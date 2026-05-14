# Building Scraper

Scraper uses `electron-builder` for packaging and npm scripts for validation.

## Prerequisites

- Node.js 20 or newer.
- npm, using the committed `package-lock.json`.
- macOS for the supported release build.

Install dependencies with:

```bash
npm ci
```

Use `npm install` during local development when intentionally updating dependencies.

## Quality Gate

Run this before packaging or opening a pull request:

```bash
npm run check
```

`npm run check` runs ESLint, TypeScript checking, and the Node test suite.

## Supported Release Build

Build the supported macOS package:

```bash
npm run build:mac
```

Artifacts are written to `dist/`.

## Experimental Package Targets

The repository also includes Windows and Linux package scripts:

```bash
npm run build:win
npm run build:linux
npm run build:all
```

These targets are for contributor testing until the project has platform-specific validation, signing, and release notes. Do not advertise them as supported end-user releases yet.

## CI

The GitHub Actions workflow validates the project on Node.js 20 and 22, then packages macOS, Windows, and Linux artifacts. Only the macOS artifact is part of the first supported release policy.

## Signing Status

Current release artifacts are unsigned. Before publishing stable public binaries, configure macOS Developer ID signing and notarization, and add equivalent signing policy for any future Windows release.
