# Secure Config Directory

This folder is intentionally kept out of the deployment sync so that you can
upload sensitive configuration (e.g. SMTP credentials) manually _after_ the
GitHub Action has finished.

## Expected file layout

- `mail.secrets.php` &rarr; should return an associative array with the
  credentials the API needs. Example skeleton:

```php
<?php
declare(strict_types=1);

return [
    // Shared defaults (used only if a language specific key is missing)
    'SMTP_PORT'      => '587',
    'FROM_NAME'      => 'base64:V2Vic2l0ZSBPbmJvYXJk', // "Website Onboard"

    // German instance (spezialcode.de)
    'SMTP_HOST_DE'   => 'base64:c210cC5zcGV6aWFsY29kZS5kZQ==',
    'SMTP_USER_DE'   => 'base64:cG9zdGJveEBzcGV6aWFsY29kZS5kZQ==',
    'SMTP_PASS_DE'   => 'base64:ZVNlaHIzQmVuMzZlaQ==',
    'FROM_EMAIL_DE'  => 'base64:aW5mb0BzcGV6aWFsY29kZS5kZQ==',
    'TO_EMAIL_DE'    => 'base64:aW5ib3gucHJvamVrdEBzcGV6aWFsY29kZS5kZQ==',

    // English instance (specialcode.de)
    'SMTP_HOST_EN'   => 'base64:c210cC5zcGVjaWFsY29kZS5kZQ==',
    'SMTP_USER_EN'   => 'base64:cG9zdGJveEBzcGVjaWFsY29kZS5kZQ==',
    'SMTP_PASS_EN'   => 'base64:NmNnZ0Q1V2ZzZ0hJ',
    'FROM_EMAIL_EN'  => 'base64:aW5mb0BzcGVjaWFsY29kZS5kZQ==',
    'TO_EMAIL_EN'    => 'base64:c2FsZXNAc3BlY2lhbGNvZGUuZGU=',
];
```

> Note: During runtime the API automatically base64-decodes values starting
> with `base64:`. Plain text values still work, but encoding the secrets
> provides a little extra obfuscation at rest.

### Required keys per language

Because the backend enforces a dedicated mailbox per domain, the following
entries **must** exist for each language you serve:

- `SMTP_HOST_DE` / `SMTP_HOST_EN`
- `SMTP_USER_DE` / `SMTP_USER_EN`
- `SMTP_PASS_DE` / `SMTP_PASS_EN`
- `FROM_EMAIL_DE` / `FROM_EMAIL_EN`
- `TO_EMAIL_DE` / `TO_EMAIL_EN`

`SMTP_PORT_[DE|EN]` is optional (defaults to `587`), and `FROM_NAME_[DE|EN]`
falls back to `FROM_NAME` if it is omitted.

## Deployment behaviour

- The GitHub Action excludes `app/secure-config/**` so nothing inside this
  folder is uploaded or deleted during deploys.
- Upload your `mail.secrets.php` manually via SFTP/FTP once the deploy has
  finished. The backend will automatically pick it up; if it is missing the
  API responds with `503` and logs a warning instead of leaking stack traces.

Quick helper to generate base64 strings without leaving traces in your shell
history:

```powershell
php -r "echo base64_encode('super-secret-password');"
```
