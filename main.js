/**
 * Scraper - YouTube Video Downloader
 * A secure Electron application for downloading YouTube videos using yt-dlp
 *
 * @license MIT
 * @author Scraper Contributors
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { exec, spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const { URL } = require("url");

/** @type {Electron.BrowserWindow | null} */
let mainWindow = null;
const activeDownloads = new Map();

// Find yt-dlp executable path
function getYtDlpPath() {
  const commonPaths = [
    "/opt/homebrew/bin/yt-dlp", // Apple Silicon Homebrew
    "/usr/local/bin/yt-dlp", // Intel Homebrew
    "/usr/bin/yt-dlp", // System install
    path.join(process.env.HOME || "/tmp", ".local/bin/yt-dlp"), // User install
  ];

  // Check common paths first
  for (const ytdlpPath of commonPaths) {
    if (fs.existsSync(ytdlpPath)) {
      return ytdlpPath;
    }
  }

  // Fall back to PATH lookup
  return "yt-dlp";
}

// Security: Disable hardware acceleration if needed for compatibility
// app.disableHardwareAcceleration();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    icon: path.join(__dirname, "Logo", "Scraper Logo.PNG"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, "preload.js"),
      // Security: Disable web security features that could be exploited
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
    // Security: Set Content Security Policy
    show: false,
  });

  mainWindow.loadFile("index.html");

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Security: Prevent navigation to external sites
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== "file://") {
      event.preventDefault();
    }
  });

  // Security: Prevent opening new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Open external links in default browser instead
    shell.openExternal(url);
    return { action: "deny" };
  });

  // Security: Disable devTools in production
  if (!process.argv.includes("--dev")) {
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  // Clean up any active downloads
  activeDownloads.forEach((process) => {
    if (process && !process.killed) {
      process.kill();
    }
  });
  activeDownloads.clear();

  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Utility: Validate YouTube URL
/**
 * @param {string} urlString
 * @returns {boolean}
 */
function isValidYouTubeUrl(urlString) {
  try {
    const url = new URL(urlString);
    const validDomains = [
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "youtu.be",
      "www.youtu.be",
    ];
    return validDomains.some(
      (domain) => url.hostname === domain || url.hostname.endsWith("." + domain)
    );
  } catch {
    return false;
  }
}

// Utility: Sanitize file path
/**
 * @param {string} filePath
 * @returns {string}
 */
function sanitizePath(filePath) {
  // Remove any potentially dangerous characters
  return path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, "");
}

// Utility: Check if yt-dlp is available
function checkYtDlpAvailable() {
  return new Promise((resolve) => {
    const ytdlpPath = getYtDlpPath();
    // eslint-disable-next-line security/detect-child-process
    exec(`"${ytdlpPath}" --version`, (_error) => {
      resolve(!_error);
    });
  });
}

// Get video info
ipcMain.handle("get-video-info", async (event, url) => {
  // Security: Validate URL
  if (!url || typeof url !== "string") {
    throw { error: "Invalid URL provided" };
  }

  if (!isValidYouTubeUrl(url)) {
    throw { error: "Please provide a valid YouTube URL" };
  }

  // Check if yt-dlp is available
  const ytdlpAvailable = await checkYtDlpAvailable();
  if (!ytdlpAvailable) {
    throw {
      error:
        "yt-dlp is not installed or not found in PATH. Please install it first.",
    };
  }

  return new Promise((resolve, reject) => {
    // Security: Use array format to prevent command injection
    const ytdlpPath = getYtDlpPath();
    const ytdlp = spawn(ytdlpPath, ["-J", "--no-warnings", url], {
      timeout: 30000, // 30 second timeout
    });

    let stdout = "";
    let stderr = "";

    ytdlp.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    ytdlp.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    ytdlp.on("close", (code) => {
      if (code === 0) {
        try {
          const data = JSON.parse(stdout);
          // Security: Only return necessary data
          const safeData = {
            title: data.title || "Unknown",
            thumbnail: data.thumbnail || "",
            uploader: data.uploader || data.channel || "Unknown",
            duration: data.duration || 0,
            description: data.description || "",
            tags: data.tags || [],
            view_count: data.view_count || 0,
            like_count: data.like_count || 0,
            upload_date: data.upload_date || "",
            categories: data.categories || [],
            webpage_url: data.webpage_url || "",
            formats: (data.formats || []).map((f) => ({
              format_id: f.format_id,
              format: f.format,
              format_note: f.format_note,
              ext: f.ext,
              resolution: f.resolution,
              fps: f.fps,
              vcodec: f.vcodec,
              acodec: f.acodec,
              filesize: f.filesize,
              filesize_approx: f.filesize_approx,
            })),
          };
          resolve(safeData);
        } catch (e) {
          reject({
            error: "Failed to parse video information",
            details: e instanceof Error ? e.message : String(e),
          });
        }
      } else {
        reject({
          error: "Failed to fetch video information",
          details: stderr || "Unknown error",
        });
      }
    });

    ytdlp.on("error", (error) => {
      reject({ error: "Failed to execute yt-dlp", details: error.message });
    });
  });
});

// Select download folder
ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory", "createDirectory"],
    title: "Select Download Folder",
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = result.filePaths[0];

    // Security: Verify the path exists and is writable
    try {
      await fs.promises.access(selectedPath, fs.constants.W_OK);
      return selectedPath;
      // eslint-disable-next-line no-unused-vars
    } catch (_error) {
      throw { error: "Selected folder is not writable" };
    }
  }
  return null;
});

// Download video
ipcMain.handle(
  "download-video",
  async (event, { url, formatId, outputPath }) => {
    // Security: Validate inputs
    if (!url || typeof url !== "string" || !isValidYouTubeUrl(url)) {
      throw { error: "Invalid URL provided" };
    }

    if (!formatId || typeof formatId !== "string") {
      throw { error: "Invalid format ID provided" };
    }

    if (!outputPath || typeof outputPath !== "string") {
      throw { error: "Invalid output path provided" };
    }

    // Security: Sanitize and validate output path
    const safePath = sanitizePath(outputPath);

    try {
      await fs.promises.access(safePath, fs.constants.W_OK);
    } catch {
      throw { error: "Output path is not writable" };
    }

    // Check if yt-dlp is available
    const ytdlpAvailable = await checkYtDlpAvailable();
    if (!ytdlpAvailable) {
      throw { error: "yt-dlp is not installed or not found in PATH" };
    }

    return new Promise((resolve, reject) => {
      const filename = "%(title)s.%(ext)s";
      const outputTemplate = path.join(safePath, filename);

      // Security: Use array format to prevent command injection
      const ytdlpPath = getYtDlpPath();
      const args = [
        "-f",
        formatId,
        "-o",
        outputTemplate,
        "--no-playlist",
        "--no-warnings",
        "--newline",
        "--progress",
        url,
      ];

      const ytdlp = spawn(ytdlpPath, args, {
        timeout: 3600000, // 1 hour timeout for large downloads
      });

      // Track active download
      const downloadId = Date.now();
      activeDownloads.set(downloadId, ytdlp);

      ytdlp.stdout.on("data", (data) => {
        const output = data.toString();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("download-progress", output);
        }
      });

      ytdlp.stderr.on("data", (data) => {
        const output = data.toString();
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("download-progress", output);
        }
      });

      ytdlp.on("close", (code) => {
        activeDownloads.delete(downloadId);

        if (code === 0) {
          resolve({ success: true });
        } else {
          reject({ error: `Download failed with exit code ${code}` });
        }
      });

      ytdlp.on("error", (error) => {
        activeDownloads.delete(downloadId);
        reject({ error: `Failed to execute yt-dlp: ${error.message}` });
      });
    });
  }
);

// Cancel download
ipcMain.handle("cancel-download", async () => {
  activeDownloads.forEach((process) => {
    if (process && !process.killed) {
      process.kill("SIGTERM");
    }
  });
  activeDownloads.clear();
  return { success: true };
});
