# Building Scraper

This guide details how to build Scraper for distribution. The project uses `electron-builder`.

## Prerequisites

-   Node.js v20+
-   `npm` or `yarn`

## Build Commands

To build the application for different platforms, use the following commands:

-   **macOS**: `npm run build:mac`
-   **Windows**: `npm run build:win`
-   **Linux**: `npm run build:linux`
-   **All Platforms**: `npm run build:all`

The build output will be placed in the `dist/` directory.

## Build Configuration

The `build` section of `package.json` configures `electron-builder` to bundle the application using files like `main.js`, `preload.js`, and `renderer.js`, ignoring unnecessary files.
