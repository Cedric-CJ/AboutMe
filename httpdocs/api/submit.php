<?php
declare(strict_types=1);
session_start();
header('Content-Type: application/json; charset=utf-8');
mb_internal_encoding('UTF-8');

// 1) CORS (erlaube NUR deine Domains)
header('Vary: Origin');
if (isset($_SERVER['HTTP_ORIGIN'])) {
  $allowed = [
    'https://specialcode.de',
    'https://www.specialcode.de',
    'https://spezialcode.de',
    'https://www.spezialcode.de',
    'http://localhost:5173',   // Vite Dev Server
    'http://127.0.0.1:5173',   // Vite Dev Server (alternative)
    'https://cedric-cj.github.io/AboutMe'    //GitHub Pages
  ];
  if (in_array($_SERVER['HTTP_ORIGIN'], $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-ALTCHA-Spam-Filter');
    header('Access-Control-Max-Age: 86400');
  }
}

// 2) Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit();
}

// 3) Nur POST erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
  http_response_code(405);
  header('Allow: POST');
  exit(json_encode(['ok' => false, 'error' => 'Method not allowed']));
}

// 4) Rate-Limiting (IP-basiert; einfach)
$ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
$key = 'last_submit_' . $ip;
if (!empty($_SESSION[$key]) && time() - $_SESSION[$key] < 10) {
  http_response_code(429);
  exit(json_encode(['ok' => false, 'error' => 'Bitte kurz warten und erneut senden.']))
;
}
$_SESSION[$key] = time();

// 5) JSON-Input parsen
$rawInput = file_get_contents('php://input');
$input = json_decode($rawInput, true);
if (!is_array($input)) {
  http_response_code(400);
  exit(json_encode(['ok' => false, 'error' => 'Invalid JSON']));
}

// 6) CSRF (optional - kann aus JSON kommen oder über Session)
// Da Frontend ALTCHA verwendet, ist CSRF weniger kritisch, aber kann aktiviert werden
// if (empty($input['csrf']) || empty($_SESSION['csrf']) || !hash_equals($_SESSION['csrf'], $input['csrf'])) {
//   http_response_code(403);
//   exit(json_encode(['ok' => false, 'error' => 'Sicherheitsprüfung fehlgeschlagen']))
;
// }

// 7) Honeypot (Bots füllen meist das "company"-Feld)
if (!empty($input['company'])) {
  // stiller Abbruch (kein Erfolg signalisieren)
  http_response_code(200);
  exit(json_encode(['ok' => true]));
}

// 8) ALTCHA Verifizierung
if (empty($input['altcha'])) {
  http_response_code(422);
  exit(json_encode(['ok' => false, 'error' => 'ALTCHA verification missing']));
}

// ALTCHA Payload validieren (robuster Pfad: httpdocs/app oder account-root/app)
$APP_DIR = null;
$candidates = array_filter([
  __DIR__ . '/../app',
  __DIR__ . '/../../app',
  isset($_SERVER['DOCUMENT_ROOT']) ? rtrim($_SERVER['DOCUMENT_ROOT'], '/\\') . '/app' : null,
  isset($_SERVER['DOCUMENT_ROOT']) ? dirname(rtrim($_SERVER['DOCUMENT_ROOT'], '/\\')) . '/app' : null,
]);
foreach ($candidates as $c) {
  $resolved = @realpath($c);
  if ($resolved !== false && @is_dir($resolved)) {
    $APP_DIR = $resolved;
    break;
  }
}
header('X-Debug-App-Dir: ' . (string)$APP_DIR);
if ($APP_DIR === null) {
  http_response_code(500);
  exit(json_encode(['ok' => false, 'error' => 'App directory not found']));
}
// ALTCHA Payload validieren
$altchaFile = $APP_DIR . '/security/altcha.php';
if (!@is_file($altchaFile)) {
  http_response_code(500);
  exit(json_encode(['ok' => false, 'error' => 'ALTCHA library not found']));
}
require_once $altchaFile;
if (!verifyAltcha($input['altcha'])) {
  http_response_code(422);
  exit(json_encode(['ok' => false, 'error' => 'ALTCHA verification failed']));
}

// 9) Eingaben validieren
$name = trim((string)($input['name'] ?? ''));
$email = trim((string)($input['email'] ?? ''));
$phone = trim((string)($input['phone'] ?? ''));
$subject = trim((string)($input['subject'] ?? ''));
$message = trim((string)($input['message'] ?? ''));
$source = trim((string)($input['source'] ?? 'unknown'));
$service_id = $input['service_id'] ?? null;

$errors = [];
if ($name === '') $errors['name'] = 'Name fehlt';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors['email'] = 'E-Mail ungültig';
if ($message === '' || mb_strlen($message) < 5) $errors['message'] = 'Nachricht zu kurz (mindestens 5 Zeichen)';

if ($errors) {
  http_response_code(422);
  exit(json_encode(['ok' => false, 'errors' => $errors]));
}

// 10) Mailversand via PHPMailer
$autoload = $APP_DIR . '/vendor/autoload.php';
if (!@is_file($autoload)) {
  http_response_code(500);
  exit(json_encode(['ok' => false, 'error' => 'Mailer library not found']));
}
require $autoload;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Decode helper for values stored with simple prefixes (e.g. base64:...).
 */
function decodeSecretValue($value) {
  if (!is_string($value)) {
    return $value;
  }
  $prefix = 'base64:';
  if (strpos($value, $prefix) === 0) {
    $decoded = base64_decode(substr($value, strlen($prefix)), true);
    if ($decoded !== false) {
      return $decoded;
    }
  }
  return $value;
}

/**
 * Load additional secrets from app/secure-config/mail.secrets.php if present.
 */
function loadSecureConfig(): array {
  static $cache = null;
  if ($cache !== null) {
    return $cache;
  }
  $cache = [];
  $files = [
    __DIR__ . '/../app/secure-config/mail.secrets.php',
    __DIR__ . '/../../app/secure-config/mail.secrets.php',
  ];
  foreach ($files as $file) {
    if (!is_readable($file)) {
      continue;
    }
    $data = include $file;
    if (!is_array($data)) {
      continue;
    }
    foreach ($data as $k => $v) {
      if (!is_string($k)) {
        continue;
      }
      $cache[$k] = decodeSecretValue($v);
    }
  }
  return $cache;
}

// Environment-Loader
function env($key, $default = null) {
  static $vars = null;
  if ($vars === null) {
    $vars = [];
    // try both httpdocs/app and account-root/app
    $paths = [
      __DIR__ . '/../app/.env',
      __DIR__ . '/../../app/.env',
    ];
    foreach ($paths as $path) {
      if (!is_readable($path)) continue;
      foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (empty($line) || $line[0] === '#') continue;
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
          $k = trim($parts[0]);
          $v = trim($parts[1]);
          if ($k !== '') {
            $vars[$k] = decodeSecretValue($v);
          }
        }
      }
    }
    // Allow manual secure-config overrides to win
    foreach (loadSecureConfig() as $k => $v) {
      $vars[$k] = $v;
    }
  }
  return array_key_exists($key, $vars) ? $vars[$key] : $default;
}

// Domain erkennen: spezialcode.de => de, specialcode.de => en
function detectDomainLang(): string {
  $host = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_HOST'] ?? '');
  if (stripos($host, 'spezialcode.de') !== false) return 'de';
  if (stripos($host, 'specialcode.de') !== false) return 'en';
  return 'de'; // Fallback
}

// Hole ENV mit Sprachsuffix, z. B. SMTP_HOST_DE oder SMTP_HOST_EN, fallback optional
function envLang(string $baseKey, ?string $lang = null, $default = null, bool $requireExact = false) {
  $lang = $lang ?: detectDomainLang();
  $suffix = strtoupper($lang);
  $keyExact = $baseKey . '_' . $suffix;
  $val = env($keyExact, null);
  if ($val !== null && $val !== '') {
    return $val;
  }
  if ($requireExact) {
    throw new RuntimeException('Missing configuration key: ' . $keyExact);
  }
  return env($baseKey, $default);
}

try {
  $lang = detectDomainLang();
  $fromE = envLang('FROM_EMAIL', $lang, null, true);
  $fromN = envLang('FROM_NAME', $lang) ?: 'Website';
  // If TO_EMAIL is missing, gracefully fall back to FROM_EMAIL instead of throwing (prevents 503)
  try {
    $toYou = envLang('TO_EMAIL', $lang, null, false) ?: $fromE;
  } catch (Throwable $e) {
    // Older deploys may still throw if requireExact was true; fallback to from-address
    $toYou = $fromE;
  }
  $smtpHost = envLang('SMTP_HOST', $lang, null, true);
  $smtpPort = (int)envLang('SMTP_PORT', $lang, 587);
  $smtpUser = envLang('SMTP_USER', $lang, null, true);
  $smtpPass = envLang('SMTP_PASS', $lang, null, true);

  if ($smtpPort <= 0) {
    $smtpPort = 587;
  }
  if (empty($fromE) || empty($smtpHost) || empty($smtpUser) || empty($smtpPass)) {
    throw new RuntimeException('SMTP configuration incomplete for domain context: ' . $lang);
  }

  // 9a) E-Mail an dich (Firmen-Benachrichtigung)
  $m = new PHPMailer(true);
  $m->isSMTP();
  $m->Host = $smtpHost;
  $m->Port = $smtpPort;
  $m->SMTPAuth = true;
  // Encryption: SMTPS for port 465, otherwise STARTTLS
  if ($m->Port === 465) {
    $m->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  } else {
    $m->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  }
  $m->Username = $smtpUser;
  $m->Password = $smtpPass;
  $m->CharSet = 'UTF-8';

  // WICHTIG: From = deine Domain (keine Spoofs); Reply-To = Kunde
  $m->setFrom($fromE, $fromN);
  // Set envelope sender (Return-Path) to your domain to avoid SPF/DMARC issues,
  // but the logical "sender" for the header is the user via Reply-To.
  $m->Sender = $fromE;
  $m->addAddress($toYou, $fromN);
  // Hidden backup copy so new requests are not missed on mobile
  $m->addBCC('cedric.jon.arnhold@gmail.com', 'Cedric Arnhold (Backup)');
  $m->addReplyTo($email, $name);
  
  $emailSubject = 'Neue Anfrage über das Kontaktformular';
  if ($source === 'service' && $service_id) {
    $emailSubject = 'Neue Service-Anfrage: ' . $service_id;
  }
  
  $m->Subject = $emailSubject;
  
  $bodyText = "Name: $name\n";
  $bodyText .= "E-Mail: $email\n";
  if ($phone) $bodyText .= "Telefon: $phone\n";
  if ($subject) $bodyText .= "Betreff: $subject\n";
  if ($service_id) $bodyText .= "Service: $service_id\n";
  // Quelle im internen Mailtext nicht erforderlich
  $bodyText .= "Nachricht:\n$message";
  
  $m->Body = $bodyText;
  $m->send();

  // 9b) Bestätigungs-E-Mail an den Kunden
  $m2 = new PHPMailer(true);
  $m2->isSMTP();
  $m2->Host = $smtpHost;
  $m2->Port = $smtpPort;
  $m2->SMTPAuth = true;
  if ($m2->Port === 465) {
    $m2->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
  } else {
    $m2->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
  }
  $m2->Username = $smtpUser;
  $m2->Password = $smtpPass;
  $m2->CharSet = 'UTF-8';
  
  $m2->setFrom($fromE, $fromN);
  $m2->addAddress($email, $name);

  // Sprache der Nachricht heuristisch erkennen (DE/EN)
  $detectMessageLang = function(string $text, string $fallback) {
    $t = mb_strtolower($text);
    $scoreDe = 0; $scoreEn = 0;
    foreach ([' der ', ' die ', ' das ', ' und ', ' bitte', ' danke', 'hallo', 'grüße', 'gruesse', 'ß', 'ä', 'ö', 'ü'] as $m) {
      if (mb_strpos($t, $m) !== false) $scoreDe++;
    }
    foreach ([' the ', ' and ', ' you ', ' please', ' thanks', ' thank you', ' hello', ' hi ', 'regards'] as $m) {
      if (mb_strpos($t, $m) !== false) $scoreEn++;
    }
    if ($scoreDe === $scoreEn) return $fallback; // tie-breaker: domain language
    return ($scoreDe > $scoreEn) ? 'de' : 'en';
  };
  $msgLang = $detectMessageLang($message, $lang);

  $host = $_SERVER['HTTP_ORIGIN'] ?? ($_SERVER['HTTP_HOST'] ?? '');
  $brandDomain = stripos($host, 'spezialcode') !== false ? 'spezialcode.de' : 'specialcode.de';

  if ($msgLang === 'en') {
    $m2->Subject = 'Inquiry received - ' . $brandDomain;
    $confirmationText  = "Hello $name,\n\n";
    $confirmationText .= "I've received your message. I usually reply within the next 7 business days.\n\n";
    $confirmationText .= "Best regards\nCedric Arnhold\nSpecialcode\n\n";
    $confirmationText .= "Your message:\n$message\n\n";
  } else {
    $m2->Subject = 'Anfrage erhalten - ' . $brandDomain;
    $confirmationText  = "Hallo $name,\n\n";
    $confirmationText .= "deine Nachricht ist bei mir eingegangen. Ich melde mich in der Regel innerhalb der nächsten 7 Werktage bei dir.\n\n";
    $confirmationText .= "Viele Grüße\nCedric Arnhold\nSpezialcode\n\n";
    $confirmationText .= "Deine Nachricht:\n$message\n\n";
  }

  $m2->Body = $confirmationText;
  $m2->send();

  // Erfolg
  echo json_encode(['ok' => true, 'message' => 'Anfrage erfolgreich gesendet']);
  
} catch (Throwable $e) {
  // Log nur Metadaten; KEINE Inhalte
  $logPath = ($APP_DIR ?: (__DIR__ . '/../app')) . '/logs/mail.log';
  $logDir = dirname($logPath);
  if (!is_dir($logDir)) @mkdir($logDir, 0750, true);
  @error_log('[mail_error] ' . date('c') . ' ip=' . $ip . ' msg=' . $e->getMessage() . "\n", 3, $logPath);

  $status = ($e instanceof RuntimeException) ? 503 : 500;
  http_response_code($status);
  $publicError = $status === 503
    ? 'Service derzeit nicht verfügbar. Bitte versuchen Sie es später erneut.'
    : 'Versand fehlgeschlagen. Bitte versuchen Sie es später erneut.';
  // Return detailed error only when debug=1 is provided (never include secrets)
  $response = ['ok' => false, 'error' => $publicError];
  if (isset($_GET['debug']) && $_GET['debug'] === '1') {
    $response['debug'] = [
      'message' => $e->getMessage(),
      'file' => $e->getFile(),
      'line' => $e->getLine()
    ];
  }
  echo json_encode($response);
}
