<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// CORS (erlaube NUR deine Domains)
header('Vary: Origin');
// Whitelist für erlaubte Origins
$allowed = [
  'https://specialcode.de',
  'https://www.specialcode.de',
  'https://spezialcode.de',
  'https://www.spezialcode.de',
  'http://localhost:5173', // Vite Dev Server
  'http://127.0.0.1:5173', // Vite Dev Server (alternative)
  'https://cedric-cj.github.io/AboutMe'    //GitHub Pages
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host   = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');

// Debug-Header zur Diagnose (nur für Entwicklung unkritisch)
header('X-Debug-CORS: challenge.php');
header('X-Debug-Origin: ' . (string)$origin);
header('X-Debug-Host: ' . (string)$host);

// Echo Origin zurück wenn erlaubt
if ($origin && in_array($origin, $allowed, true)) {
  header('Access-Control-Allow-Origin: ' . $origin);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
}
// Dev-Fallbacks, wenn lokal gehostet
elseif (stripos($host, '127.0.0.1') !== false || stripos($host, 'localhost') !== false) {
  $isDevOrigin = (bool)preg_match('#^http://(localhost|127\\.0\\.0\\.1):5173$#', (string)$origin);
  $devOrigin = $isDevOrigin ? $origin : 'http://localhost:5173';
  header('Access-Control-Allow-Origin: ' . $devOrigin);
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Allow-Methods: GET, OPTIONS');
  header('Access-Control-Allow-Headers: Content-Type');
}

// Preflight Request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

// Nur GET erlauben
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
  http_response_code(405);
  header('Allow: GET');
  exit(json_encode(['error' => 'Method not allowed']));
}

// ALTCHA Challenge generieren (robuster Pfad: innerhalb httpdocs/app oder außerhalb in ../app)
$APP_DIR = null;
$candidates = [
  __DIR__ . '/../app',      // httpdocs/app
  __DIR__ . '/../../app',   // account-root/app
];
foreach ($candidates as $c) {
  $resolved = @realpath($c);
  if ($resolved !== false && @is_dir($resolved)) {
    $APP_DIR = $resolved;
    break;
  }
}
if ($APP_DIR === null) {
  http_response_code(500);
  exit(json_encode(['error' => 'App directory not found']));
}
$altchaFile = $APP_DIR . '/security/altcha.php';
if (!@is_file($altchaFile)) {
  http_response_code(500);
  exit(json_encode(['error' => 'ALTCHA library not found']));
}
require_once $altchaFile;

try {
  $challenge = generateAltchaChallenge();
  echo json_encode($challenge);
} catch (Throwable $e) {
  http_response_code(500);
  $resp = ['error' => 'Challenge generation failed'];
  if (isset($_GET['debug'])) {
    $resp['message'] = $e->getMessage();
  }
  echo json_encode($resp);
}
