<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=()');
header('Strict-Transport-Security: max-age=63072000; includeSubDomains; preload');

// CORS configuration
header('Vary: Origin');

// Whitelist for allowed origins
$allowed = [
    'https://specialcode.de',
    'https://www.specialcode.de',
    'https://spezialcode.de',
    'https://www.spezialcode.de',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://cedric-cj.github.io'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? ($_SERVER['SERVER_NAME'] ?? '');

// Debug headers (safe to remove in production)
if (isset($_GET['debug'])) {
    header('X-Debug-CORS: challenge.php');
    header('X-Debug-Origin: ' . (string)$origin);
    header('X-Debug-Host: ' . (string)$host);
}

// Handle CORS
$isAllowedOrigin = in_array($origin, $allowed, true);
$isLocalhost = (stripos($host, '127.0.0.1') !== false || stripos($host, 'localhost') !== false);
$isDevOrigin = (bool)preg_match('#^http://(localhost|127\.0\.0\.1):5173$#', (string)$origin);

if ($isAllowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
} elseif ($isLocalhost && $isDevOrigin) {
    // Only allow localhost in development
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Credentials: true');
}

header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Requested-With, X-ALTCHA-Spam-Filter');
header('Access-Control-Max-Age: 86400');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit();
}

// Only allow GET method for actual requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Allow: GET');
    exit(json_encode(['error' => 'Method not allowed']));
}

// Resolve app directory
function resolveAppDir(): ?string {
    $docRoot = $_SERVER['DOCUMENT_ROOT'] ?? null;
    $candidates = array_filter([
        __DIR__ . '/../app',
        __DIR__ . '/../../app',
        $docRoot ? rtrim($docRoot, '/\\') . '/app' : null,
        $docRoot ? dirname(rtrim($docRoot, '/\\')) . '/app' : null,
    ]);
    
    foreach ($candidates as $candidate) {
        $resolved = @realpath($candidate);
        if ($resolved !== false && @is_dir($resolved)) {
            return $resolved;
        }
    }
    return null;
}

$APP_DIR = resolveAppDir();

if (isset($_GET['debug'])) {
    header('X-Debug-App-Dir: ' . (string)$APP_DIR);
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
    echo json_encode($challenge, JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    http_response_code(500);
    if (isset($_GET['debug'])) {
        header('X-Debug-Error: ' . substr($e->getMessage(), 0, 120));
        $response = [
            'error' => 'Challenge generation failed',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ];
    } else {
        $response = ['error' => 'Internal server error'];
    }
    echo json_encode($response);
}

