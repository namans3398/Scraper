# Scraper

[![Build](https://github.com/namans3398/Scraper/actions/workflows/build.yml/badge.svg)](https://github.com/namans3398/Scraper/actions/workflows/build.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Scraper is a secure, open-source desktop application for downloading videos through `yt-dlp`. It provides a focused Electron interface for fetching video metadata, choosing available formats, selecting an output folder, downloading thumbnails, and tracking download progress.

The first production-ready release is **macOS-first**. Windows and Linux package targets exist in the build configuration for contributor testing, but they are not considered supported release platforms until they have dedicated validation and signing coverage.

## Features

- Fetch video metadata with `yt-dlp`.
- Display title, channel, duration, upload metadata, thumbnail, tags, and available formats.
- Download selected video/audio formats to a user-selected folder.
- Download thumbnails separately.
- Detect and update local `yt-dlp` and `ffmpeg` dependencies.
- Use Electron security controls: context isolation, sandboxing, disabled Node.js integration in the renderer, validated IPC, and a local Content Security Policy.

## Requirements

- macOS for the supported first release.
- Node.js 20 or newer for source builds.
- `yt-dlp` for metadata and video downloads.
- `ffmpeg` when selected formats require audio/video merging.

## Quick Start

```bash
git clone https://github.com/namans3398/Scraper.git
cd Scraper
npm install
npm start
```

Run the full local quality gate before opening a pull request:

```bash
npm run check
```

## Documentation

- [Installation Guide](docs/INSTALL.md)
- [Building from Source](docs/BUILD.md)
- [Security Policy](docs/SECURITY.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [FAQ](docs/FAQ.md)
- [Production Checklist](docs/PRODUCTION_CHECKLIST.md)

## Release Status

Public binaries for the first release should be published as an unsigned draft GitHub release until code signing and notarization are configured. macOS users may need to approve the app manually in System Settings when testing unsigned builds.

## License

Scraper is licensed under the [MIT License](LICENSE).

## Legal Notice

Scraper is a graphical frontend for `yt-dlp`. Use it only with content you have the right to access and download. You are responsible for complying with website terms of service, copyright law, and local regulations.
