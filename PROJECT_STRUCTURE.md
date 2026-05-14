# Project Structure

Complete overview of the Scraper project structure and organization.

## Directory Structure

```
scraper/
├── .github/                      # GitHub-specific files
│   ├── ISSUE_TEMPLATE/          # Issue templates
│   │   ├── bug_report.md        # Bug report template
│   │   └── feature_request.md   # Feature request template
│   ├── workflows/               # GitHub Actions
│   │   └── build.yml            # Build workflow
│   ├── FUNDING.yml              # Funding/sponsorship info
│   └── PULL_REQUEST_TEMPLATE.md # PR template
│
├── .vscode/                     # VS Code settings
│   └── settings.json            # Editor configuration
│
├── node_modules/                # Dependencies (gitignored)
│
├── .editorconfig                # Editor configuration
├── .env.example                 # Environment variables template
├── .gitignore                   # Git ignore rules
├── .npmrc                       # NPM configuration
│
├── CHANGELOG.md                 # Version history
├── CODE_OF_CONDUCT.md          # Community guidelines
├── CONTRIBUTING.md             # Contribution guidelines
├── FAQ.md                      # Frequently asked questions
├── INSTALL.md                  # Installation instructions
├── LICENSE                     # MIT License
├── PROJECT_STRUCTURE.md        # This file
├── README.md                   # Main documentation
├── SECURITY.md                 # Security policy
│
├── index.html                  # Application UI
├── main.js                     # Electron main process
├── preload.js                  # Secure IPC bridge
├── renderer.js                 # UI logic
├── styles.css                  # Application styling
│
├── package.json                # Project metadata & dependencies
└── package-lock.json           # Dependency lock file
```

## Core Application Files

### main.js
**Purpose**: Electron main process
- Creates application window
- Handles IPC communication
- Manages video info fetching
- Handles download operations
- Implements security measures

**Key Functions**:
- `createWindow()` - Creates the main application window
- `isValidYouTubeUrl()` - Validates YouTube URLs
- `checkYtDlpAvailable()` - Checks if yt-dlp is installed
- IPC handlers for video info, downloads, folder selection

### preload.js
**Purpose**: Secure bridge between main and renderer
- Exposes safe APIs to renderer process
- Validates all inputs before IPC calls
- Implements context isolation

**Exposed APIs**:
- `getVideoInfo(url)` - Fetch video information
- `selectFolder()` - Open folder selection dialog
- `downloadVideo(data)` - Start video download
- `cancelDownload()` - Cancel active download
- `onDownloadProgress(callback)` - Listen to download progress

### renderer.js
**Purpose**: UI logic and event handling
- Handles user interactions
- Displays video information
- Manages download progress
- Implements input validation and sanitization

**Key Functions**:
- `fetchVideoInfo()` - Fetches and displays video info
- `displayVideoInfo()` - Renders video metadata
- `displayFormats()` - Shows available formats
- `selectFormat()` - Handles format selection
- Utility functions for formatting (duration, bytes, dates)

### index.html
**Purpose**: Application interface
- Defines UI structure
- Implements Content Security Policy
- Responsive layout with home screen and main app

**Key Sections**:
- Home screen with centered search
- Header with search bar
- Video preview and metadata
- Format selection list
- Download controls and progress

### styles.css
**Purpose**: Application styling
- Modern dark theme
- Responsive design
- Smooth animations and transitions
- Accessibility-friendly

## Documentation Files

### README.md
Main project documentation with:
- Project overview and features
- Quick start guide
- Usage instructions
- Links to other documentation

### INSTALL.md
Comprehensive installation guide:
- Prerequisites (Node.js, yt-dlp)
- Platform-specific instructions
- Building from source
- Troubleshooting

### FAQ.md
Frequently asked questions covering:
- General questions
- Installation and setup
- Usage
- Troubleshooting
- Legal and ethical considerations
- Technical details

### SECURITY.md
Security documentation:
- Security features implemented
- Vulnerability reporting process
- Supported versions
- Security update policy

### CONTRIBUTING.md
Contribution guidelines:
- How to contribute
- Development setup
- Code style guidelines
- Testing requirements
- Commit message format

### CHANGELOG.md
Version history:
- Release notes
- New features
- Bug fixes
- Breaking changes
- Planned features

### CODE_OF_CONDUCT.md
Community standards:
- Expected behavior
- Unacceptable behavior
- Enforcement responsibilities
- Reporting process

## Configuration Files

### package.json
Project metadata and configuration:
- Dependencies (Electron, electron-builder)
- Scripts (start, dev, build)
- Build configuration for all platforms
- Project metadata (name, version, license)

### .gitignore
Specifies files to ignore in Git:
- node_modules/
- Build output (dist/, build/)
- Logs and temporary files
- OS-specific files
- IDE settings (except approved ones)

### .editorconfig
Editor configuration for consistency:
- UTF-8 encoding
- LF line endings
- 2-space indentation
- Trim trailing whitespace

### .npmrc
NPM configuration:
- Save exact versions
- Enable package lock

### .vscode/settings.json
VS Code settings:
- Format on save
- Tab size and spacing
- Line endings
- Code actions

## GitHub Files

### .github/ISSUE_TEMPLATE/
Issue templates for:
- Bug reports (structured bug reporting)
- Feature requests (structured feature proposals)

### .github/PULL_REQUEST_TEMPLATE.md
PR template with:
- Description
- Type of change
- Testing checklist
- Security considerations

### .github/workflows/build.yml
GitHub Actions workflow:
- Automated builds on push/PR
- Multi-platform testing (macOS, Windows, Linux)
- Multi-version Node.js testing

### .github/FUNDING.yml
Funding/sponsorship configuration:
- GitHub Sponsors
- Patreon
- Ko-fi
- Custom links

## Build Output (Not in Repository)

### dist/
Generated by electron-builder:
- macOS: `.dmg`, `.zip`
- Windows: `.exe` (installer and portable)
- Linux: `.AppImage`, `.deb`

## Dependencies

### Production Dependencies
None - Uses only Electron built-in modules

### Development Dependencies
- **electron**: Application framework
- **electron-builder**: Build and packaging tool

## Security Architecture

### Context Isolation
- Renderer process is isolated from Node.js
- Only specific APIs exposed via preload script

### Input Validation
- All user inputs validated before processing
- URL validation against allowed domains
- Path sanitization to prevent traversal

### Command Injection Prevention
- Uses `spawn` with array arguments
- No shell execution with user input
- Timeouts on all external processes

### XSS Prevention
- Safe DOM text rendering for displayed content
- Content Security Policy enforced
- No inline scripts or eval()

### Process Security
- Sandboxed renderer process
- External navigation blocked
- New window creation denied
- DevTools disabled in production

## Code Organization

### Separation of Concerns
- **Main process**: System operations, IPC handlers
- **Preload**: Secure API bridge
- **Renderer**: UI logic only
- **Styles**: Presentation layer

### Security Layers
1. Input validation in renderer
2. Input validation in preload
3. Input validation in main process
4. Sanitization before system calls

### Error Handling
- Try-catch blocks for async operations
- User-friendly error messages
- Detailed error logging
- Graceful degradation

## Development Workflow

1. **Setup**: `npm install`
2. **Development**: `npm run dev`
3. **Testing**: Manual testing on target platforms
4. **Building**: `npm run build:mac|win|linux`
5. **Distribution**: Upload to GitHub Releases

## Best Practices Implemented

✅ Security-first design
✅ Input validation at every layer
✅ Comprehensive documentation
✅ Clear code organization
✅ Consistent code style
✅ Detailed comments
✅ Error handling
✅ User feedback
✅ Accessibility considerations
✅ Cross-platform compatibility
✅ Open-source friendly
✅ Community guidelines
✅ Issue and PR templates
✅ Automated builds (CI/CD ready)

## Future Enhancements

See [CHANGELOG.md](CHANGELOG.md) for planned features.

---

**Last Updated**: 2024-11-11
**Version**: 1.0.0
