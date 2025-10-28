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
function generateAltchaChallenge(): array {
  $secret = getEnv('ALTCHA_SECRET_KEY');
  if (!$secret) {
    throw new RuntimeException('ALTCHA_SECRET_KEY not set in .env');
  }
  
  // Salt generieren (zufällige Zeichenkette)
  $salt = bin2hex(random_bytes(16));
  
  // Zufällige Zahl für den Challenge
  $number = random_int(10000, 999999);
  
  // Challenge berechnen: HMAC-SHA256 von Salt + Number
  $challenge = hash_hmac('sha256', $salt . $number, $secret);
  
  // Signature generieren (für spätere Verifizierung)
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
 * Verifiziert eine ALTCHA-Lösung
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
  
  // Pflichtfelder prüfen
  $required = ['algorithm', 'challenge', 'number', 'salt', 'signature'];
  foreach ($required as $field) {
    if (!isset($data[$field])) {
      return false;
    }
  }
  
  // Nur SHA-256 unterstützt
  if ($data['algorithm'] !== 'SHA-256') {
    return false;
  }
  
  // Lösung verifizieren: hash(salt + number) muss challenge ergeben
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
