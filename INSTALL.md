# Installation Guide

Complete installation instructions for Scraper on all supported platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Platform-Specific Instructions](#platform-specific-instructions)
- [Building from Source](#building-from-source)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### 1. Node.js (Required)

Download and install Node.js v20 or higher from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

### 2. yt-dlp (Required)

yt-dlp is the core tool used for downloading videos. Choose your installation method:

#### macOS

**Using Homebrew (Recommended):**
```bash
brew install yt-dlp
```

**Using pip:**
```bash
pip3 install yt-dlp
```

**Using binary:**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

#### Windows

**Using pip:**
```bash
pip install yt-dlp
```

**Using Chocolatey:**
```bash
choco install yt-dlp
```

**Using Scoop:**
```bash
scoop install yt-dlp
```

**Manual installation:**
1. Download `yt-dlp.exe` from [releases page](https://github.com/yt-dlp/yt-dlp/releases)
2. Place it in a folder in your PATH (e.g., `C:\Windows\System32`)

#### Linux

**Using pip:**
```bash
pip3 install yt-dlp
```

**Using package manager:**
```bash
# Ubuntu/Debian
sudo apt install yt-dlp

# Fedora
sudo dnf install yt-dlp

# Arch Linux
sudo pacman -S yt-dlp
```

**Using binary:**
```bash
sudo wget https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -O /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

### Verify yt-dlp Installation

```bash
yt-dlp --version
```

You should see a version number (e.g., `2024.10.22`).

## Quick Start

### Option 1: Download Pre-built Binary (Recommended)

1. Go to [Releases](https://github.com/namans3398/Scraper/releases)
2. Download the appropriate file for your platform:
   - **macOS**: `Scraper-1.0.0.dmg` or `Scraper-1.0.0-mac.zip`
   - **Windows**: `Scraper-Setup-1.0.0.exe` or `Scraper-1.0.0-win.exe`
   - **Linux**: `Scraper-1.0.0.AppImage` or `scraper_1.0.0_amd64.deb`
3. Install and run

### Option 2: Run from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/namans3398/Scraper.git
   cd scraper
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

## Platform-Specific Instructions

### macOS

#### Running the App

After downloading the DMG:
1. Open the DMG file
2. Drag Scraper to Applications folder
3. Open from Applications

**First Launch Security:**
If you see "Scraper can't be opened because it is from an unidentified developer":
1. Go to System Preferences → Security & Privacy
2. Click "Open Anyway" next to the Scraper message
3. Or right-click the app and select "Open"

#### Building from Source

```bash
npm install
npm run build:mac
```

Output: `dist/Scraper-1.0.0.dmg` and `dist/Scraper-1.0.0-mac.zip`

### Windows

#### Running the App

**Installer:**
1. Download `Scraper-Setup-1.0.0.exe`
2. Run the installer
3. Follow installation wizard
4. Launch from Start Menu or Desktop

**Portable:**
1. Download `Scraper-1.0.0-win.exe`
2. Run directly (no installation needed)

**Windows Defender:**
If Windows Defender blocks the app:
1. Click "More info"
2. Click "Run anyway"

#### Building from Source

```bash
npm install
npm run build:win
```

Output: `dist/Scraper-Setup-1.0.0.exe` and `dist/Scraper-1.0.0-win.exe`

### Linux

#### Running the App

**AppImage (Universal):**
```bash
chmod +x Scraper-1.0.0.AppImage
./Scraper-1.0.0.AppImage
```

**Debian/Ubuntu (.deb):**
```bash
sudo dpkg -i scraper_1.0.0_amd64.deb
scraper
```

#### Building from Source

```bash
npm install
npm run build:linux
```

Output: `dist/Scraper-1.0.0.AppImage` and `dist/scraper_1.0.0_amd64.deb`

## Building from Source

### Development Build

```bash
# Clone repository
git clone https://github.com/namans3398/Scraper.git
cd scraper

# Install dependencies
npm install

# Run in development mode
npm start

# Run with DevTools enabled
npm run dev
```

### Production Build

Build for your current platform:
```bash
npm run build:mac    # macOS
npm run build:win    # Windows
npm run build:linux  # Linux
```

Build for all platforms (requires platform-specific tools):
```bash
npm run build:mac && npm run build:win && npm run build:linux
```

### Build Requirements

- **macOS builds**: Must be built on macOS
- **Windows builds**: Can be built on any platform with Wine
- **Linux builds**: Can be built on any platform

## Troubleshooting

### yt-dlp not found

**Problem:** "yt-dlp is not installed or not found in PATH"

**Solutions:**
1. Verify yt-dlp is installed: `yt-dlp --version`
2. Restart your terminal/command prompt
3. Check PATH environment variable includes yt-dlp location
4. Reinstall yt-dlp using one of the methods above

### Permission Errors

**Problem:** "Output path is not writable" or "Permission denied"

**Solutions:**
1. Choose a different download folder (e.g., Desktop or Documents)
2. Check folder permissions
3. On macOS/Linux: `chmod 755 /path/to/folder`
4. Run as administrator (Windows) - not recommended

### Download Fails

**Problem:** Downloads fail or hang

**Solutions:**
1. Check internet connection
2. Verify the YouTube URL is valid and accessible
3. Update yt-dlp: `pip install --upgrade yt-dlp`
4. Try a different video format
5. Check if video is region-restricted

### App Won't Start

**Problem:** Application doesn't launch

**Solutions:**
1. Check Node.js is installed: `node --version`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check console for errors: `npm start` (from terminal)
4. Verify system requirements are met

### Build Errors

**Problem:** Build fails with errors

**Solutions:**
1. Clear cache: `npm cache clean --force`
2. Delete node_modules: `rm -rf node_modules`
3. Reinstall: `npm install`
4. Update npm: `npm install -g npm@latest`
5. Check electron-builder logs in `dist/` folder

## Getting Help

If you encounter issues not covered here:

1. Check [existing issues](https://github.com/namans3398/Scraper/issues)
2. Search [discussions](https://github.com/namans3398/Scraper/discussions)
3. Create a [new issue](https://github.com/namans3398/Scraper/issues/new) with:
   - Your OS and version
   - Node.js version (`node --version`)
   - yt-dlp version (`yt-dlp --version`)
   - Error messages or logs
   - Steps to reproduce

## System Requirements

### Minimum Requirements
- **OS**: macOS 10.13+, Windows 10+, or Linux (64-bit)
- **RAM**: 2 GB
- **Disk**: 100 MB for app + space for downloads
- **Internet**: Required for downloading videos

### Recommended Requirements
- **OS**: Latest version of macOS, Windows 11, or modern Linux
- **RAM**: 4 GB or more
- **Disk**: SSD with ample free space
- **Internet**: Broadband connection for faster downloads

