# Project Structure

-   `main.js`: The Electron main process script. Manages window lifecycle and secure IPC handlers.
-   `preload.js`: Exposes a limited, secure API to the renderer process via `contextBridge`.
-   `renderer.js`: The frontend script that interacts with the UI (DOM) and sends messages to the main process via the preload API.
-   `index.html`: The main user interface document.
-   `styles.css`: Stylesheet for the user interface.
-   `lib/core.js`: Core domain logic and utilities for processing downloads.
-   `Logo/`: Contains application icons and assets.
-   `test/`: Contains automated tests.
-   `docs/`: Contains project documentation.
-   `package.json`: Project metadata, scripts, and `electron-builder` configuration.
