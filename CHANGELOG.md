# Changelog

All notable changes to Scraper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-11

### Added
- Initial release of Scraper
- YouTube video information fetching
- Multiple format selection (video + audio, audio only)
- Real-time download progress tracking
- Cancel download functionality
- Custom download location selection
- Video metadata display (title, thumbnail, duration, views, likes, upload date)
- Video description and tags display
- Comprehensive security features:
  - Input validation and sanitization
  - Command injection prevention
  - XSS protection
  - Content Security Policy (CSP)
  - Path traversal prevention
  - Context isolation and sandboxing
- Cross-platform support (macOS, Windows, Linux)
- Modern, responsive dark theme UI
- Home screen with centered search
- Header search for quick lookups
- Format categorization (Video+Audio, Audio Only)
- File size display for formats
- Keyboard shortcuts (Enter to search)
- Error handling and user feedback

### Security
- Implemented comprehensive security measures
- All user inputs validated and sanitized
- Command injection prevention via spawn arrays
- Safe DOM text rendering to prevent XSS attacks
- Content Security Policy enforced
- Sandboxed renderer process
- Context isolation enabled
- External navigation blocked
- DevTools disabled in production

### Documentation
- Comprehensive README with badges
- Detailed INSTALL.md with platform-specific instructions
- SECURITY.md with security policy and reporting
- CONTRIBUTING.md with development guidelines
- CODE_OF_CONDUCT.md for community standards
- MIT LICENSE
- .editorconfig for consistent code style
- .gitignore for clean repository

## [Unreleased]

### Planned Features
- Playlist download support
- Download queue management
- Download history
- Custom filename templates
- Proxy support
- Subtitle download options
- Audio extraction with quality selection
- Batch download from file
- Dark/Light theme toggle
- Multiple language support
- Auto-update functionality

---

## Version History

- **1.0.0** - Initial public release

## Links

- [GitHub Repository](https://github.com/namans3398/Scraper)
- [Issue Tracker](https://github.com/namans3398/Scraper/issues)
- [Releases](https://github.com/namans3398/Scraper/releases)
