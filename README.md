# Scraper

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-39+-blue.svg)](https://www.electronjs.org/)

A secure, production-ready Electron desktop application for downloading YouTube videos using yt-dlp. Built with security best practices and a modern, intuitive interface.

## Features

- 🔒 **Secure by design** - Input validation, command injection prevention, CSP
- 📹 **Video metadata** - Fetch title, thumbnail, duration, and uploader info
- 🎯 **Format selection** - Choose from all available video/audio formats with size info
- 📊 **Real-time progress** - Live download progress tracking
- 🚫 **Cancel downloads** - Stop downloads in progress
- 📁 **Custom location** - Choose where to save your downloads
- ⚡ **Fast & lightweight** - Minimal dependencies, efficient processing

## Security Features

This application implements comprehensive security measures:

- ✅ Context isolation and sandboxing
- ✅ Input validation and sanitization
- ✅ Command injection prevention
- ✅ XSS protection with safe DOM text rendering
- ✅ Content Security Policy (CSP)
- ✅ Path traversal prevention
- ✅ No remote code execution
- ✅ External navigation blocking

See [SECURITY.md](SECURITY.md) for detailed security information.

## Quick Start

### Prerequisites
- **Node.js** v20+ ([Download](https://nodejs.org/))
- **yt-dlp** ([Installation Guide](INSTALL.md#2-yt-dlp-required))

### Installation

**Option 1: Download Pre-built App** (Recommended)
- Download from [Releases](https://github.com/namans3398/Scraper/releases)
- See [INSTALL.md](INSTALL.md) for detailed instructions

**Option 2: Run from Source**
```bash
git clone https://github.com/namans3398/Scraper.git
cd scraper
npm install
npm start
```

For detailed installation instructions, see [INSTALL.md](INSTALL.md).

## Usage

1. **Launch** the application
2. **Paste** a YouTube video URL
3. **Click** "Get Video Info" to fetch video details
4. **Select** your preferred format from the list
5. **Choose** download location by clicking "Browse"
6. **Click** "Download" to start downloading

### Keyboard Shortcuts
- `Enter` - Fetch video info (when URL input is focused)
- Click logo - Return to home screen

## Project Structure

```
scraper/
├── main.js           # Electron main process (secure IPC handlers)
├── preload.js        # Secure bridge between main and renderer
├── renderer.js       # UI logic with input validation
├── index.html        # Application interface with CSP
├── styles.css        # Modern, responsive styling
├── package.json      # Dependencies and build config
├── SECURITY.md       # Security documentation
└── README.md         # This file
```

## Documentation

- 📦 [Installation Guide](INSTALL.md) - Detailed setup instructions
- ❓ [FAQ](FAQ.md) - Frequently asked questions
- 🔒 [Security Policy](SECURITY.md) - Security features and reporting
- 🤝 [Contributing Guide](CONTRIBUTING.md) - How to contribute
- 📋 [Code of Conduct](CODE_OF_CONDUCT.md) - Community guidelines
- 📝 [Changelog](CHANGELOG.md) - Version history and updates

## Troubleshooting

Common issues and solutions:

| Issue             | Solution                                            |
| ----------------- | --------------------------------------------------- |
| yt-dlp not found  | Install yt-dlp and verify with `yt-dlp --version`   |
| Download fails    | Check internet connection and URL validity          |
| Permission errors | Select a writable folder (Desktop, Documents, etc.) |
| App won't start   | Verify Node.js is installed: `node --version`       |

For more help, see [INSTALL.md](INSTALL.md#troubleshooting) or [open an issue](https://github.com/namans3398/Scraper/issues).

## Building from Source

### Build for Current Platform
```bash
npm run build
```

### Build for Specific Platforms
```bash
npm run build:mac      # macOS (DMG + ZIP)
npm run build:win      # Windows (NSIS + Portable)
npm run build:linux    # Linux (AppImage + DEB + RPM)
npm run build:all      # All platforms
```

Or use the build script:
```bash
./build.sh mac         # macOS
./build.sh win         # Windows
./build.sh linux       # Linux
./build.sh all         # All platforms
```

Built packages will be in the `dist/` folder. See [BUILD.md](BUILD.md) for detailed build instructions, code signing, and distribution.

## Development

### Tech Stack
- Electron 39+
- Native Node.js APIs
- yt-dlp CLI tool

### Security Best Practices
- All user inputs are validated
- Command injection prevention via spawn arrays
- No eval() or dynamic code execution
- Sandboxed renderer process
- Content Security Policy enforced

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Guidelines
- Follow existing code style
- Add comments for complex logic
- Test security-sensitive changes thoroughly
- Update documentation as needed

## Changelog

### Version 1.0.0
- Initial release
- Secure video information fetching
- Multiple format selection
- Real-time download progress
- Cross-platform support (macOS, Windows, Linux)

## Disclaimer

This tool is for personal use only. Respect copyright laws and YouTube's Terms of Service. Only download videos you have permission to download. The developers are not responsible for any misuse of this software.

## Support

- ❓ [FAQ](FAQ.md) - Common questions and answers
- 📖 [Documentation](https://github.com/namans3398/Scraper#documentation)
- 🐛 [Report Issues](https://github.com/namans3398/Scraper/issues)
- 💬 [Discussions](https://github.com/namans3398/Scraper/discussions)
- Security reports: see [SECURITY.md](SECURITY.md)

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- Powered by [yt-dlp](https://github.com/yt-dlp/yt-dlp)
- Inspired by the open-source community
