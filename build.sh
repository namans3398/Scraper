#!/bin/bash

# Scraper Build Script
# Builds the Electron app for different platforms

set -e

echo "🚀 Scraper Build Script"
echo "======================="
echo ""

# Check if electron-builder is installed
if ! npm list electron-builder > /dev/null 2>&1; then
    echo "❌ electron-builder not found. Installing dependencies..."
    npm install
fi

# Parse command line arguments
PLATFORM="${1:-current}"

case "$PLATFORM" in
    mac|macos|darwin)
        echo "🍎 Building for macOS..."
        npm run build:mac
        ;;
    win|windows)
        echo "🪟 Building for Windows..."
        npm run build:win
        ;;
    linux)
        echo "🐧 Building for Linux..."
        npm run build:linux
        ;;
    all)
        echo "🌍 Building for all platforms..."
        npm run build:all
        ;;
    current)
        echo "💻 Building for current platform..."
        npm run build
        ;;
    *)
        echo "❌ Unknown platform: $PLATFORM"
        echo ""
        echo "Usage: ./build.sh [platform]"
        echo "Platforms: mac, win, linux, all, current (default)"
        exit 1
        ;;
esac

echo ""
echo "✅ Build complete! Check the 'dist' folder for your packages."
echo ""
