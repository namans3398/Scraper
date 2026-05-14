# Scraper vX.Y.Z

## Supported Platform

- macOS is the supported platform for this release.
- Windows and Linux artifacts, if present, are experimental contributor outputs and are not supported end-user releases.

## Signing Status

These artifacts are unsigned. macOS may warn before first launch. Download only from the official repository and approve the app manually only if you trust the source and artifact.

## Artifacts

- Attach the macOS DMG.
- Attach the macOS ZIP.
- Do not attach Windows or Linux artifacts to a public supported release unless platform validation has been completed.

## Checks

- `npm run check`
- `npm audit --audit-level=moderate`
- `npm run build:mac`
- Manual macOS smoke test from `docs/PRODUCTION_CHECKLIST.md`

## Legal Notice

Scraper is a frontend for `yt-dlp`. Use it only with content you have the right to access and download. You are responsible for complying with website terms of service, copyright law, and local regulations.
