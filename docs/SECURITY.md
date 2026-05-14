# Security Policy

## Supported Versions

Currently, only the latest release is supported with security updates.

## Reporting a Vulnerability

If you discover a security vulnerability, please open an issue in the issue tracker or contact the maintainers directly depending on the repository's contact guidelines.

## Security Controls

The application relies on standard Electron security features:
-   **Context Isolation**: Enabled to separate the renderer process environment from the preload script.
-   **Node.js Integration**: Disabled in the renderer process.
-   **Content Security Policy (CSP)**: Defines the resources the application is allowed to load.

All external inputs, such as URLs passes to `yt-dlp`, must be validated to mitigate command injection risks.
