# Scraper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Scraper is an open-source, production-ready desktop application for downloading videos using `yt-dlp`. It is built with Electron and is currently available for macOS only.

## Features

- Uses `yt-dlp` to fetch video metadata and process downloads.
- Provides a user interface to select available video and audio formats.
- Displays download progress.
- Allows specifying the output directory.
- Requires Node.js and `yt-dlp` on the host system.

## Installation and Usage

See [docs/INSTALL.md](docs/INSTALL.md) for installation and usage instructions.

## Security

This application implements context isolation, sandboxing, and a Content Security Policy (CSP). See [docs/SECURITY.md](docs/SECURITY.md).

## Development and Building

See [docs/BUILD.md](docs/BUILD.md) and [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for build procedures and architectural details.

## Documentation

- [Installation Guide](docs/INSTALL.md)
- [Building from Source](docs/BUILD.md)
- [Security](docs/SECURITY.md)
- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Contributing](docs/CONTRIBUTING.md)
- [Code of Conduct](docs/CODE_OF_CONDUCT.md)
- [FAQ](docs/FAQ.md)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This tool is a frontend for `yt-dlp`. Ensure you comply with the terms of service of the websites you access and respect local copyright laws.
