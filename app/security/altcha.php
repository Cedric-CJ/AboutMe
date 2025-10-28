<?php
declare(strict_types=1);

/**
 * ALTCHA Challenge & Verification System
 * 
 * Kompatibel mit ALTCHA JavaScript Widget
 * https://altcha.org/docs/api/
 */

// Environment-Loader
function getEnv($key, $default = null) {
  static $vars = null;
  if ($vars === null) {
    $vars = [];
    $path = __DIR__ . '/../.env';
    if (is_readable($path)) {
      foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if (empty($line) || $line[0] === '#') continue;
        // Strip UTF-8 BOM if present
        if (strncmp($line, "\xEF\xBB\xBF", 3) === 0) {
          $line = substr($line, 3);
        }
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
          $k = trim($parts[0]);
          // Also strip BOM from key just in case
          if (strncmp($k, "\xEF\xBB\xBF", 3) === 0) {
            $k = substr($k, 3);
          }
          $v = trim($parts[1]);
          if ($k !== '') $vars[$k] = $v;
        }
      }
    }
  }
  if (array_key_exists($key, $vars)) {
    return $vars[$key];
  }
  // Fallback to process environment variables
  $env = getenv($key);
  if ($env !== false) return $env;
  return $default;
}

/**
 * Generiert eine ALTCHA Challenge
 * 
 * @return array Challenge-Daten
 */

function altchaRandomBytes(int $length): string {
  if (function_exists('random_bytes')) {
    return random_bytes($length);
  }
  if (function_exists('openssl_random_pseudo_bytes')) {
    $bytes = openssl_random_pseudo_bytes($length, $cryptoStrong);
    if ($bytes !== false && $cryptoStrong === true) {
      return $bytes;
    }
  }
  $bytes = '';
  while (strlen($bytes) < $length) {
    $bytes .= chr(mt_rand(0, 255));
  }
  return substr($bytes, 0, $length);
}

function altchaRandomInt(int $min, int $max): int {
  if (function_exists('random_int')) {
    try {
      return random_int($min, $max);
    } catch (Throwable $e) {
      // fallback below
    }
  }
  return mt_rand($min, $max);
}

function generateAltchaChallenge(): array {
  $secret = getEnv('ALTCHA_SECRET_KEY');
  if (!$secret) {
    throw new RuntimeException('ALTCHA_SECRET_KEY not set in .env');
  }
  
  // Salt generieren (zufÃ¤llige Zeichenkette)
  $salt = bin2hex(altchaRandomBytes(16));
  
  // ZufÃ¤llige Zahl fÃ¼r den Challenge
  $number = altchaRandomInt(10000, 999999);
  
  // Challenge berechnen: HMAC-SHA256 von Salt + Number
  $challenge = hash_hmac('sha256', $salt . $number, $secret);
  
  // Signature generieren (fÃ¼r spÃ¤tere Verifizierung)
  $signature = hash_hmac('sha256', json_encode([
    'algorithm' => 'SHA-256',
    'challenge' => $challenge,
    'salt' => $salt,
    'signature' => ''
  ], JSON_UNESCAPED_SLASHES), $secret);
  
  return [
    'algorithm' => 'SHA-256',
    'challenge' => $challenge,
    'salt' => $salt,
    'signature' => $signature
  ];
}

/**
 * Verifiziert eine ALTCHA-LÃ¶sung
 * 
 * @param string $payload Base64-encoded JSON payload
 * @return bool True wenn valid
 */
function verifyAltcha(string $payload): bool {
  $secret = getEnv('ALTCHA_SECRET_KEY');
  if (!$secret) {
    return false;
  }
  
  // Payload dekodieren
  $decoded = base64_decode($payload, true);
  if (!$decoded) {
    return false;
  }
  
  $data = json_decode($decoded, true);
  if (!is_array($data)) {
    return false;
  }
  
  // Pflichtfelder prÃ¼fen
  $required = ['algorithm', 'challenge', 'number', 'salt', 'signature'];
  foreach ($required as $field) {
    if (!isset($data[$field])) {
      return false;
    }
  }
  
  // Nur SHA-256 unterstÃ¼tzt
  if ($data['algorithm'] !== 'SHA-256') {
    return false;
  }
  
  // LÃ¶sung verifizieren: hash(salt + number) muss challenge ergeben
  $expectedChallenge = hash_hmac('sha256', $data['salt'] . $data['number'], $secret);
  if (!hash_equals($expectedChallenge, $data['challenge'])) {
    return false;
  }
  
  // Signature verifizieren
  $signaturePayload = json_encode([
    'algorithm' => $data['algorithm'],
    'challenge' => $data['challenge'],
    'salt' => $data['salt'],
    'signature' => ''
  ], JSON_UNESCAPED_SLASHES);
  
  $expectedSignature = hash_hmac('sha256', $signaturePayload, $secret);
  if (!hash_equals($expectedSignature, $data['signature'])) {
    return false;
  }
  
  return true;
}
