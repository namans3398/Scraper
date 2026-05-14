# Security Policy

## Supported Versions

Only the latest release line is supported with security fixes. The first supported release target is macOS.

## Reporting a Vulnerability

Do not open a public issue for suspected security vulnerabilities.

Use GitHub private vulnerability reporting if it is enabled for the repository. If it is not enabled, contact the maintainer through the repository owner's GitHub profile and include enough detail to reproduce the issue privately.

Please include:

- Affected Scraper version or commit.
- Operating system and CPU architecture.
- Steps to reproduce.
- Impact and expected attacker capabilities.
- Logs, screenshots, or proof-of-concept details when safe to share.

## Security Controls

Scraper is built with the following controls:

- Electron renderer runs with Node.js integration disabled.
- Context isolation and sandboxing are enabled.
- The preload script exposes a narrow `contextBridge` API.
- IPC handlers validate URLs, output paths, format IDs, and dependency paths.
- External commands are launched with argument arrays instead of shell interpolation.
- Browser navigation is restricted, and new windows are denied.
- Thumbnail and dependency downloads enforce protocol, redirect, size, and timeout limits.
- The app uses a local Content Security Policy for the renderer.

## Dependency Security

Run these checks before release:

```bash
npm run check
npm audit --audit-level=moderate
```

Keep `yt-dlp`, `ffmpeg`, Electron, and build tooling current. Website extractor behavior changes frequently, so many download issues are resolved by updating `yt-dlp`.

## Responsible Use

Scraper is a frontend for `yt-dlp`. Users are responsible for complying with website terms, copyright law, and local regulations.
