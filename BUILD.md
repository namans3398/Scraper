# Building Scraper

This guide explains how to build Scraper for different platforms.

## Prerequisites

- Node.js 16+ and npm installed
- For macOS builds: macOS with Xcode Command Line Tools
- For Windows builds: Windows or macOS/Linux with Wine
- For Linux builds: Any platform

## Quick Start

### Build for Current Platform

```bash
npm run build
```

Or use the build script:

```bash
./build.sh
```

### Build for Specific Platform

```bash
# macOS
npm run build:mac
# or
./build.sh mac

# Windows
npm run build:win
# or
./build.sh win

# Linux
npm run build:linux
# or
./build.sh linux

# All platforms
npm run build:all
# or
./build.sh all
```

## Output

Built packages will be in the `dist/` folder:

### macOS
- `Scraper-1.0.0.dmg` - DMG installer
- `Scraper-1.0.0-mac.zip` - Portable ZIP
- Supports both Intel (x64) and Apple Silicon (arm64)

### Windows
- `Scraper Setup 1.0.0.exe` - NSIS installer (x64 and ia32)
- `Scraper 1.0.0.exe` - Portable executable (x64)

### Linux
- `Scraper-1.0.0.AppImage` - AppImage (universal)
- `scraper_1.0.0_amd64.deb` - Debian package
- `scraper-1.0.0.x86_64.rpm` - RPM package

## Platform-Specific Notes

### macOS

The app is built with hardened runtime and requires entitlements. For distribution:

1. **Code Signing**: Set environment variables before building:
   ```bash
   export CSC_LINK=/path/to/certificate.p12
   export CSC_KEY_PASSWORD=your_password
   npm run build:mac
   ```

2. **Notarization**: For distribution outside the App Store:
   ```bash
   export APPLE_ID=your@email.com
   export APPLE_ID_PASSWORD=app-specific-password
   npm run build:mac
   ```

### Windows

Building on non-Windows platforms requires Wine:

```bash
# macOS
brew install wine-stable

# Linux
sudo apt-get install wine64
```

### Linux

The AppImage is the most universal format. For distribution:

- `.deb` for Debian/Ubuntu
- `.rpm` for Fedora/RHEL/CentOS
- `.AppImage` for any Linux distribution

## Build Configuration

Edit `package.json` under the `build` section to customize:

- App ID and product name
- Target architectures
- Installer options
- File associations
- Auto-update settings

## Troubleshooting

### "electron-builder not found"
```bash
npm install
```

### "Icon not found"
Ensure `Logo/Scraper Logo.PNG` exists and is at least 512x512 pixels.

### macOS build fails with code signing error
Either provide valid certificates or disable code signing:
```bash
export CSC_IDENTITY_AUTO_DISCOVERY=false
npm run build:mac
```

### Windows build fails on macOS/Linux
Install Wine (see Windows section above).

## Clean Build

To start fresh:

```bash
npm run clean
npm install
npm run build
```

## Development Build

For testing without full packaging:

```bash
npm start
# or with dev tools
npm run dev
```

## Distribution

Before distributing:

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Test on target platforms
4. Sign and notarize (macOS)
5. Create GitHub release with binaries

## Additional Resources

- [electron-builder docs](https://www.electron.build/)
- [Code signing guide](https://www.electron.build/code-signing)
- [Auto-update setup](https://www.electron.build/auto-update)
