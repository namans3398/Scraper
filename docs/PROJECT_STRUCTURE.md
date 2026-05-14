# Project Structure

Scraper is a compact Electron app with a small shared core module and a documented release workflow.

## Application

- `main.js`: Electron main process, window lifecycle, dependency resolution, secure IPC handlers, and download orchestration.
- `preload.js`: Narrow `contextBridge` API exposed to the renderer.
- `renderer.js`: DOM interaction, app state, dependency modal behavior, format selection, and progress display.
- `index.html`: Local renderer document.
- `styles.css`: Renderer styling.
- `lib/core.js`: Shared validation, download, archive, filename, path, and version helpers.
- `types.d.ts`: Renderer-facing API type declarations.

## Tests And Quality

- `test/`: Node test suite for core helpers and download safety behavior.
- `eslint.config.js`: ESLint configuration.
- `tsconfig.json`: JavaScript type-checking configuration.
- `package.json`: npm scripts, package metadata, dependencies, and `electron-builder` configuration.
- `package-lock.json`: Locked npm dependency graph.

## Release And Documentation

- `Logo/`: Application icons and release assets.
- `build/`: Packaging support files such as macOS entitlements.
- `.github/`: CI workflow, issue templates, pull request template, and funding metadata.
- `docs/`: Installation, build, security, contribution, FAQ, project structure, and release checklist documentation.
- `CHANGELOG.md`: Release history.
- `LICENSE`: MIT license.
- `SECURITY.md`: GitHub-facing pointer to the full security policy.

## Generated Or Local Files

Do not commit generated packages or local machine artifacts. `dist/`, `node_modules/`, logs, caches, `.env` files, and OS metadata are ignored.
