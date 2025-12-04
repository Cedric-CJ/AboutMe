<?php
declare(strict_types=1);

/**
 * ALTCHA Challenge & Verification System
 */

function altchaDecodeValue($value) {
  if (!is_string($value)) {
    return $value;
  }
  $prefix = 'base64:';
  if (strncmp($value, $prefix, strlen($prefix)) === 0) {
    $decoded = base64_decode(substr($value, strlen($prefix)), true);
    if ($decoded !== false) {
      return $decoded;
    }
  }
  return $value;
}

function altchaLoadSecureConfig(): array {
  static $cache = null;
  if ($cache !== null) {
    return $cache;
  }
  $cache = [];
  $files = [
    __DIR__ . '/../secure-config/mail.secrets.php',
    __DIR__ . '/../../secure-config/mail.secrets.php',
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
      $cache[$k] = altchaDecodeValue($v);
    }
  }
  return $cache;
}

function altchaEnv($key, $default = null) {
  static $vars = null;
  if ($vars === null) {
    $vars = [];
    $path = __DIR__ . '/../.env';
    if (is_readable($path)) {
      foreach (file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
        if ($line === '' || $line[0] === '#') {
          continue;
        }
        if (strncmp($line, "\xEF\xBB\xBF", 3) === 0) {
          $line = substr($line, 3);
        }
        $parts = explode('=', $line, 2);
        if (count($parts) === 2) {
          $k = trim($parts[0]);
          if (strncmp($k, "\xEF\xBB\xBF", 3) === 0) {
            $k = substr($k, 3);
          }
          $v = trim($parts[1]);
          if ($k !== '') {
            $vars[$k] = altchaDecodeValue($v);
          }
        }
      }
    }
    foreach (altchaLoadSecureConfig() as $k => $v) {
      $vars[$k] = $v;
    }
  }
  if (array_key_exists($key, $vars)) {
    return $vars[$key];
  }
  $env = getenv($key);
  if ($env !== false) {
    return altchaDecodeValue($env);
  }
  return $default;
}

function altchaRandomBytes(int $length): string {
  if (function_exists('random_bytes')) {
    return random_bytes($length);
  }
  if (function_exists('openssl_random_pseudo_bytes')) {
    $bytes = openssl_random_pseudo_bytes($length, $strong);
    if ($bytes !== false && $strong === true) {
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
      // fall back to mt_rand
    }
  }
  return mt_rand($min, $max);
}

function generateAltchaChallenge(): array {
  $secret = altchaEnv('ALTCHA_SECRET_KEY');
  if (!$secret) {
    throw new RuntimeException('ALTCHA_SECRET_KEY not set in .env');
  }
  $salt = bin2hex(altchaRandomBytes(16));
  $number = altchaRandomInt(0, 99999);
  // The puzzle must be solvable client-side, so the challenge is a plain hash
  // of salt + number (no secret involved). The secret is only used to sign the
  // payload to prevent tampering.
  $challenge = hash('sha256', $salt . $number);
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
    'signature' => $signature,
    'maxnumber' => 99999
  ];
}

function verifyAltcha(string $payload): bool {
  $secret = altchaEnv('ALTCHA_SECRET_KEY');
  if (!$secret) {
    return false;
  }
  $decoded = base64_decode($payload, true);
  if ($decoded === false) {
    return false;
  }
  $data = json_decode($decoded, true);
  if (!is_array($data)) {
    return false;
  }
  foreach (['algorithm', 'challenge', 'number', 'salt', 'signature'] as $field) {
    if (!isset($data[$field])) {
      return false;
    }
  }
  if ($data['algorithm'] !== 'SHA-256') {
    return false;
  }
  // Validate the proof-of-work: recompute the plain hash of salt + number.
  $expectedChallenge = hash('sha256', $data['salt'] . $data['number']);
  if (!hash_equals($expectedChallenge, $data['challenge'])) {
    return false;
  }
  $signaturePayload = json_encode([
    'algorithm' => $data['algorithm'],
    'challenge' => $data['challenge'],
    'salt' => $data['salt'],
    'signature' => ''
  ], JSON_UNESCAPED_SLASHES);
  $expectedSignature = hash_hmac('sha256', $signaturePayload, $secret);
  return hash_equals($expectedSignature, $data['signature']);
}
