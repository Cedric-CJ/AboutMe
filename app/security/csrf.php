<?php
declare(strict_types=1);

/**
 * CSRF Token Generator & Validator
 * Optional - kann später in Formularen verwendet werden
 */

/**
 * Generiert ein CSRF-Token und speichert es in der Session
 * 
 * @return string CSRF Token
 */
function generateCsrfToken(): string {
  if (session_status() === PHP_SESSION_NONE) {
    session_start();
  }
  
  if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
  }
  
  return $_SESSION['csrf'];
}

/**
 * Validiert ein CSRF-Token
 * 
 * @param string $token Token zum Prüfen
 * @return bool True wenn valid
 */
function validateCsrfToken(string $token): bool {
  if (session_status() === PHP_SESSION_NONE) {
    session_start();
  }
  
  if (empty($_SESSION['csrf'])) {
    return false;
  }
  
  return hash_equals($_SESSION['csrf'], $token);
}
