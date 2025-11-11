# Scraper

A secure, production-ready Electron desktop application for scraping and downloading YouTube videos using yt-dlp.

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
- ✅ XSS protection with HTML escaping
- ✅ Content Security Policy (CSP)
- ✅ Path traversal prevention
- ✅ No remote code execution
- ✅ External navigation blocking

See [SECURITY.md](SECURITY.md) for detailed security information.

## Prerequisites

### Required

1. **Node.js** (v16 or higher)
   - Download from: https://nodejs.org/

2. **yt-dlp** - Install using one of these methods:

   **macOS (using Homebrew):**
   ```bash
   brew install yt-dlp
   ```

   **macOS/Linux (using pip):**
   ```bash
   pip install yt-dlp
   ```

   **Windows (using pip):**
   ```bash
   pip install yt-dlp
   ```

   **Or download binary from:** https://github.com/yt-dlp/yt-dlp/releases

### Verify Installation

```bash
yt-dlp --version
```

## Installation

1. Clone or download this repository

2. Install dependencies:
   ```bash
   npm install
   ```

## Running the App

### Development Mode
```bash
npm start
```

### Development with DevTools
```bash
npm run dev
```

## Building for Production

Build standalone executables:

```bash
# macOS
npm run build:mac

# Windows
npm run build:win

# Linux
npm run build:linux
```

Built applications will be in the `dist/` folder.

## How to Use

1. **Paste URL** - Enter a YouTube video URL in the input field
2. **Fetch Info** - Click "Get Video Info" to load video details
3. **Select Format** - Choose your preferred quality/format from the list
4. **Choose Location** - Click "Browse" to select download folder
5. **Download** - Click "Download" to start (or "Cancel" to stop)

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

## Troubleshooting

### yt-dlp not found
- Ensure yt-dlp is installed: `yt-dlp --version`
- Check it's in your PATH
- Try reinstalling yt-dlp

### Download fails
- Check your internet connection
- Verify the YouTube URL is valid
- Ensure you have write permissions to the download folder
- Some videos may be restricted or unavailable

### Permission errors
- Make sure the selected download folder is writable
- On macOS/Linux, check folder permissions
- Try selecting a different download location

## Development

### Tech Stack
- Electron 27+
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

## Disclaimer

This tool is for personal use only. Respect copyright laws and YouTube's Terms of Service. Only download videos you have permission to download.
