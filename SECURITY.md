# Security Policy

## Security Features

This application implements the following security measures:

### Input Validation
- All user inputs are validated and sanitized
- YouTube URLs are validated against allowed domains
- File paths are normalized and sanitized to prevent directory traversal
- Format IDs and output paths are validated before use

### Process Security
- Uses `spawn` with array arguments to prevent command injection
- No shell execution with user-controlled strings
- Process timeouts to prevent hanging operations
- Active download tracking and cleanup

### Electron Security
- Context isolation enabled
- Node integration disabled in renderer
- Sandbox mode enabled
- Content Security Policy (CSP) implemented
- Remote module disabled
- Navigation restricted to prevent external site access
- New window creation blocked (external links open in browser)
- DevTools disabled in production builds

### Data Security
- Only necessary video metadata is exposed to renderer
- HTML escaping prevents XSS attacks
- Thumbnail URLs validated before display
- No sensitive data stored or logged

## Reporting a Vulnerability

If you discover a security vulnerability, please email [your-email@example.com].

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will respond within 48 hours and work to address valid security concerns promptly.
