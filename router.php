<?php
// Slim router for PHP built-in server and simple Apache fallback-like behavior
// Usage (from frontend/): php -S 127.0.0.1:8000 ../router.php

// Normalize request URI (strip query string)
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
$docRoot = __DIR__;

// Serve existing files directly
$requested = realpath($docRoot . $uri);
if ($requested !== false && is_file($requested)) {
  return false; // let the built-in server serve static files
}

// Handle API routes without .php extension: /api/<name> -> /api/<name>.php
if (preg_match('#^/api/([A-Za-z0-9_-]+)$#', $uri, $m)) {
  $php = $docRoot . '/api/' . $m[1] . '.php';
  if (is_file($php)) {
    require $php;
    exit;
  }
}

// If request is to an actual php file under /api/* keep behavior
if (preg_match('#^/api/.+\.php$#', $uri)) {
  $php = $docRoot . $uri;
  if (is_file($php)) {
    require $php;
    exit;
  }
}

// Development note:
// When running Vite for the SPA, the frontend is served from http://localhost:5173.
// This router only needs to handle API requests in dev.
// For any other path, return 404 JSON to make problems obvious during dev.
http_response_code(404);
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['error' => 'Not Found', 'path' => $uri]);
