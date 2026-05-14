/**
 * Scraper - YouTube Video Downloader
 * A secure Electron application for downloading YouTube videos using yt-dlp
 *
 * @license MIT
 * @author Scraper Contributors
 */

const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const { URL } = require("url");

/** @type {Electron.BrowserWindow | null} */
let mainWindow = null;
const activeDownloads = new Map();

// Find yt-dlp executable path

let userDependencyPath = null;
let configFilePath = null;

app.on("ready", () => {
  configFilePath = path.join(app.getPath("userData"), "scraper_config.json");
  if (fs.existsSync(configFilePath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
      if (config.userDependencyPath) {
        userDependencyPath = config.userDependencyPath;
      }
    } catch (e) {
      console.error("Failed to load config:", e);
    }
  }
});

function saveConfig(updates) {
  if (!configFilePath) return;
  let config = {};
  if (fs.existsSync(configFilePath)) {
    try {
      config = JSON.parse(fs.readFileSync(configFilePath, "utf8"));
    } catch (e) {
      /* ignore */
    }
  }
  Object.assign(config, updates);
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

function getYtDlpPath() {
  const customPath = process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
  if (userDependencyPath) {
    const fullPath = path.join(userDependencyPath, customPath);
    if (fs.existsSync(fullPath)) return fullPath;
  }

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

function getFfmpegPath() {
  const customPath = process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
  if (userDependencyPath) {
    const fullPath = path.join(userDependencyPath, customPath);
    if (fs.existsSync(fullPath)) return fullPath;
  }

  const commonPaths = [
    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
    "/usr/bin/ffmpeg",
    path.join(process.env.HOME || "/tmp", ".local/bin/ffmpeg"),
  ];

  for (const ffmpegPath of commonPaths) {
    if (fs.existsSync(ffmpegPath)) {
      return ffmpegPath;
    }
  }

  return "ffmpeg";
}

/**
 * @param {string} url
 * @returns {boolean}
 */
function isSafeExternalUrl(url) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
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
    try {
      const parsedUrl = new URL(navigationUrl);
      if (parsedUrl.protocol !== "file:") {
        event.preventDefault();
      }
    } catch {
      event.preventDefault();
    }
  });

  // Security: Prevent opening new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      shell.openExternal(url);
    }
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
    const hostname = url.hostname.toLowerCase();

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return false;
    }

    return (
      hostname === "youtu.be" ||
      hostname === "youtube.com" ||
      hostname.endsWith(".youtube.com")
    );
  } catch {
    return false;
  }
}

// Utility: Validate and normalize output directories received over IPC.
/**
 * @param {string} filePath
 * @returns {string}
 */
function normalizeOutputPath(filePath) {
  if (filePath.includes("\0")) {
    throw new Error("Output path contains invalid characters");
  }

  if (!path.isAbsolute(filePath)) {
    throw new Error("Output path must be absolute");
  }

  return path.resolve(filePath);
}

/**
 * @param {string} filename
 * @returns {string}
 */
function sanitizeFilename(filename) {
  return Array.from(filename)
    .filter((character) => {
      const code = character.charCodeAt(0);
      return code > 31 && !'<>:"/\\|?*'.includes(character);
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

/**
 * @param {string} thumbnailUrl
 * @returns {string}
 */
function getThumbnailExtension(thumbnailUrl) {
  try {
    const extension = path
      .extname(new URL(thumbnailUrl).pathname)
      .toLowerCase()
      .replace(".", "");

    if (["jpg", "jpeg", "png", "webp"].includes(extension)) {
      return extension === "jpeg" ? "jpg" : extension;
    }
  } catch {
    // Fall through to the default extension.
  }

  return "jpg";
}

/**
 * @param {string} thumbnailUrl
 * @returns {boolean}
 */
function isValidThumbnailUrl(thumbnailUrl) {
  try {
    const parsedUrl = new URL(thumbnailUrl);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch {
    return false;
  }
}

/**
 * @param {string} sourceUrl
 * @param {string} destinationPath
 * @param {number} redirectsRemaining
 * @returns {Promise<void>}
 */
function downloadFile(sourceUrl, destinationPath, redirectsRemaining = 5) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(sourceUrl);
    const client = parsedUrl.protocol === "https:" ? https : http;
    const tempPath = `${destinationPath}.${Date.now()}.download`;
    const request = client.get(parsedUrl, (response) => {
      const statusCode = response.statusCode || 0;

      if (
        statusCode >= 300 &&
        statusCode < 400 &&
        response.headers.location &&
        redirectsRemaining > 0
      ) {
        response.resume();
        const redirectUrl = new URL(response.headers.location, sourceUrl).href;
        downloadFile(redirectUrl, destinationPath, redirectsRemaining - 1)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (statusCode !== 200) {
        response.resume();
        reject(new Error(`Thumbnail request failed with status ${statusCode}`));
        return;
      }

      const contentLength = Number(response.headers["content-length"] || 0);
      const maxBytes = 20 * 1024 * 1024;
      if (contentLength > maxBytes) {
        response.resume();
        reject(new Error("Thumbnail file is too large"));
        return;
      }

      let receivedBytes = 0;
      const fileStream = fs.createWriteStream(tempPath, { flags: "wx" });

      response.on("data", (chunk) => {
        receivedBytes += chunk.length;
        if (receivedBytes > maxBytes) {
          request.destroy(new Error("Thumbnail file is too large"));
        }
      });

      fileStream.on("finish", () => {
        fileStream.close(async (error) => {
          if (error) {
            reject(error);
            return;
          }

          try {
            await fs.promises.rename(tempPath, destinationPath);
            resolve();
          } catch (renameError) {
            fs.promises.unlink(tempPath).catch(() => {});
            reject(renameError);
          }
        });
      });

      fileStream.on("error", (error) => {
        response.destroy();
        fs.promises.unlink(tempPath).catch(() => {});
        reject(error);
      });

      response.pipe(fileStream);
    });

    request.setTimeout(30000, () => {
      request.destroy(new Error("Thumbnail download timed out"));
    });

    request.on("error", (error) => {
      fs.promises.unlink(tempPath).catch(() => {});
      reject(error);
    });
  });
}

// Utility: Check if yt-dlp is available
/**
 * @param {string} executablePath
 * @param {string[]} args
 * @returns {Promise<boolean>}
 */
function checkExecutableAvailable(executablePath, args) {
  return new Promise((resolve) => {
    const child = spawn(executablePath, args, {
      stdio: "ignore",
      timeout: 10000,
    });

    child.on("close", (code) => {
      resolve(code === 0);
    });

    child.on("error", () => {
      resolve(false);
    });
  });
}

// Utility: Check if yt-dlp is available
function checkYtDlpAvailable() {
  return checkExecutableAvailable(getYtDlpPath(), ["--version"]);
}

function checkFfmpegAvailable() {
  return checkExecutableAvailable(getFfmpegPath(), ["-version"]);
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
    } catch {
      throw { error: "Selected folder is not writable" };
    }
  }
  return null;
});

// Download thumbnail
ipcMain.handle(
  "download-thumbnail",
  async (event, { url, title, outputPath }) => {
    if (!url || typeof url !== "string" || !isValidThumbnailUrl(url)) {
      throw { error: "Invalid thumbnail URL provided" };
    }

    const extension = getThumbnailExtension(url);
    const safeTitle = sanitizeFilename(
      typeof title === "string" && title ? title : "thumbnail",
    );
    const filename = `${safeTitle || "thumbnail"}-thumbnail.${extension}`;
    let destinationPath = "";

    if (outputPath) {
      if (typeof outputPath !== "string") {
        throw { error: "Invalid output path provided" };
      }

      let safePath;
      try {
        safePath = normalizeOutputPath(outputPath);
      } catch (error) {
        throw {
          error: error instanceof Error ? error.message : "Invalid output path",
        };
      }

      try {
        const stats = await fs.promises.stat(safePath);
        if (!stats.isDirectory()) {
          throw new Error("Output path is not a directory");
        }
        await fs.promises.access(safePath, fs.constants.W_OK);
      } catch {
        throw { error: "Output path is not writable" };
      }

      destinationPath = path.join(safePath, filename);
    } else {
      const result = await dialog.showSaveDialog(mainWindow, {
        title: "Save Thumbnail",
        defaultPath: path.join(app.getPath("downloads"), filename),
        filters: [
          { name: "Image", extensions: [extension] },
          { name: "All Files", extensions: ["*"] },
        ],
      });

      if (result.canceled || !result.filePath) {
        return { success: false, canceled: true };
      }

      destinationPath = result.filePath;
    }

    try {
      await downloadFile(url, destinationPath);
      return { success: true, path: destinationPath };
    } catch (error) {
      throw {
        error:
          error instanceof Error
            ? error.message
            : "Failed to download thumbnail",
      };
    }
  },
);

// Download video
ipcMain.handle(
  "download-video",
  async (event, { url, formatId, outputPath }) => {
    // Security: Validate inputs
    if (!url || typeof url !== "string" || !isValidYouTubeUrl(url)) {
      throw new Error("Invalid URL provided");
    }

    if (
      !formatId ||
      typeof formatId !== "string" ||
      !/^[a-zA-Z0-9._+/-]+$/.test(formatId)
    ) {
      throw new Error("Invalid format ID provided");
    }

    if (!outputPath || typeof outputPath !== "string") {
      throw new Error("Invalid output path provided");
    }

    // Security: Sanitize and validate output path
    let safePath;
    try {
      safePath = normalizeOutputPath(outputPath);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Invalid output path",
      );
    }

    try {
      const stats = await fs.promises.stat(safePath);
      if (!stats.isDirectory()) {
        throw new Error("Output path is not a directory");
      }
      await fs.promises.access(safePath, fs.constants.W_OK);
    } catch {
      throw new Error("Output path is not writable");
    }

    // Check if yt-dlp is available
    const ytdlpAvailable = await checkYtDlpAvailable();
    if (!ytdlpAvailable) {
      throw new Error("yt-dlp is not installed or not found in PATH");
    }

    if (formatId.includes("+")) {
      const ffmpegAvailable = await checkFfmpegAvailable();
      if (!ffmpegAvailable) {
        throw new Error(
          "This format needs ffmpeg to merge video and audio. Install ffmpeg or choose a Video + Audio format.",
        );
      }
    }

    return new Promise((resolve, reject) => {
      const filename = "%(title)s.%(ext)s";
      const outputTemplate = path.join(safePath, filename);
      let stderr = "";

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
        stderr += output;
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send("download-progress", output);
        }
      });

      ytdlp.on("close", (code) => {
        activeDownloads.delete(downloadId);

        if (code === 0) {
          resolve({ success: true });
        } else {
          const details = stderr.trim();
          reject(
            new Error(
              `Download failed with exit code ${code}${
                details ? `\n${details}` : ""
              }`,
            ),
          );
        }
      });

      ytdlp.on("error", (error) => {
        activeDownloads.delete(downloadId);
        reject(new Error(`Failed to execute yt-dlp: ${error.message}`));
      });
    });
  },
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

// Dependency Management
ipcMain.handle("check-dependencies", async () => {
  const ytdlp = await checkYtDlpAvailable();
  const ffmpeg = await checkFfmpegAvailable();

  let ytdlpOutdated = false;
  if (ytdlp) {
    try {
      // Check local version
      const ytdlpPath = getYtDlpPath();
      const localVersionInfo = await new Promise((resolve) => {
        const child = spawn(ytdlpPath, ["--version"]);
        let out = "";
        child.stdout.on("data", (d) => (out += d.toString()));
        child.on("close", () => resolve(out.trim()));
      });

      // Fetch latest release tag from GitHub API
      const latestVersionInfo = await new Promise((resolve) => {
        const req = https.get(
          "https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest",
          {
            headers: { "User-Agent": "Electron-Scraper-App" },
            timeout: 5000, // 5 seconds timeout to prevent hanging
          },
          (res) => {
            if (res.statusCode === 403) {
              // Rate limit
              console.log("GitHub API rate limit hit.");
              resolve(null);
              return;
            }
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              try {
                const parsed = JSON.parse(data);
                resolve(parsed.tag_name);
              } catch {
                resolve(null);
              }
            });
          },
        );
        req.on("error", () => resolve(null));
        req.on("timeout", () => {
          req.destroy();
          resolve(null);
        });
      });

      if (
        latestVersionInfo &&
        localVersionInfo &&
        latestVersionInfo !== localVersionInfo &&
        latestVersionInfo > localVersionInfo
      ) {
        ytdlpOutdated = true;
      }
    } catch (e) {
      console.error("Version check error", e);
    }
  }

  return { ytdlp, ffmpeg, ytdlpOutdated };
});

function downloadBinary(url, destPath) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": "Mozilla/5.0" } },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          downloadBinary(res.headers.location, destPath)
            .then(resolve)
            .catch(reject);
          return;
        }
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to download: ${res.statusCode}`));
          return;
        }
        const file = fs.createWriteStream(destPath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      },
    );
    req.on("error", reject);
  });
}

function extractArchive(archivePath, destDir, toolFile) {
  return new Promise((resolve, reject) => {
    try {
      const ext = path.extname(archivePath);
      let cmd = "";
      if (process.platform === "win32") {
        cmd = `tar -xf "${archivePath}" -C "${destDir}"`;
      } else if (ext === ".zip") {
        cmd = `unzip -o "${archivePath}" -d "${destDir}"`;
      } else if (ext === ".xz" || ext === ".gz") {
        cmd = `tar -xf "${archivePath}" -C "${destDir}"`;
      }

      const { exec } = require("child_process");
      exec(cmd, (error) => {
        if (error) {
          // Fallback if extraction fails
          reject(error);
          return;
        }

        // Find the extracted executable (e.g. inside nested ffmpeg folders recursively)
        const findAndMove = (dir) => {
          const files = fs.readdirSync(dir, { withFileTypes: true });
          for (let f of files) {
            const fullPath = require("path").join(dir, f.name);
            if (f.isDirectory()) {
              findAndMove(fullPath);
            } else if (
              f.isFile() &&
              f.name.includes("ffmpeg") &&
              !f.name.includes("ffprobe") &&
              !f.name.includes("ffmpeg.zip") &&
              !f.name.includes("ffmpeg.tar")
            ) {
              const targetPath = require("path").join(destDir, toolFile);
              if (fullPath !== targetPath) {
                try {
                  fs.copyFileSync(fullPath, targetPath);
                } catch (e) {
                  /* ignore */
                }
              }
            }
          }
        };

        // Simple move if found in subdirectories for ffmpeg (win/linux structure)
        if (process.platform === "win32" || process.platform === "linux") {
          try {
            findAndMove(destDir);
          } catch (e) {
            /* ignore */
          }
        }
        resolve();
      });
    } catch (e) {
      reject(e);
    }
  });
}

ipcMain.handle("download-dependencies", async (event, location) => {
  if (!fs.existsSync(location)) {
    fs.mkdirSync(location, { recursive: true });
  }
  userDependencyPath = location;
  saveConfig({ userDependencyPath: location });

  const platform = process.platform;
  let ytUrl = "";
  let ytFile = "yt-dlp";
  let ffUrl = "";
  let ffFile = "ffmpeg";
  let archiveName = "";

  if (platform === "win32") {
    ytUrl =
      "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe";
    ytFile = "yt-dlp.exe";
    ffUrl =
      "https://github.com/BtbN/FFmpeg-Builds/releases/download/latest/ffmpeg-master-latest-win64-gpl.zip";
    ffFile = "ffmpeg.exe";
    archiveName = "ffmpeg.zip";
  } else if (platform === "darwin") {
    ytUrl =
      "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp_macos";
    ffUrl = "https://evermeet.cx/ffmpeg/getrelease/zip";
    archiveName = "ffmpeg.zip";
  } else {
    ytUrl = "https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp";
    ffUrl =
      "https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz";
    archiveName = "ffmpeg.tar.xz";
  }

  const ytDest = path.join(location, ytFile);
  const archivePath = path.join(location, archiveName);

  await downloadBinary(ytUrl, ytDest);
  try {
    fs.chmodSync(ytDest, 0o755);
  } catch (e) {
    /* ignore */
  }

  await downloadBinary(ffUrl, archivePath);
  await extractArchive(archivePath, location, ffFile);

  // Cleanup archive and ensure execute permissions
  try {
    const ffDest = path.join(location, ffFile);
    if (fs.existsSync(ffDest)) fs.chmodSync(ffDest, 0o755);
    fs.unlinkSync(archivePath);
  } catch (e) {
    /* ignore */
  }

  return { success: true, message: "Dependencies downloaded to " + location };
});

ipcMain.handle("update-dependencies", async () => {
  return new Promise((resolve, reject) => {
    const ytdlpPath = getYtDlpPath();

    let cmd = ytdlpPath;
    let args = ["-U"];

    // Smart detection for package managers
    if (
      ytdlpPath.includes("homebrew") ||
      ytdlpPath.includes("Cellar") ||
      ytdlpPath.includes("/usr/local/bin")
    ) {
      cmd = "brew";
      args = ["upgrade", "yt-dlp"];
    } else if (
      ytdlpPath.includes(".local/bin") ||
      ytdlpPath.includes("pip") ||
      ytdlpPath.includes("python") ||
      ytdlpPath.includes("site-packages")
    ) {
      cmd = "pip3";
      args = ["install", "--upgrade", "yt-dlp"];
    }

    const child = spawn(cmd, args);
    let stderr = "";

    child.stderr.on("data", (d) => (stderr += d.toString()));

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ success: true });
      } else {
        // Fallback strategies if our initial detection failed or command wasn't found
        const output = stderr.toLowerCase();

        if (output.includes("brew") && cmd !== "brew") {
          const fallback = spawn("brew", ["upgrade", "yt-dlp"]);
          fallback.on("close", (fallbackCode) => {
            if (fallbackCode === 0) resolve({ success: true });
            else
              reject(
                new Error(
                  "Update failed via Homebrew. Please try downloading manually.",
                ),
              );
          });
        } else if (output.includes("pip") && cmd !== "pip3") {
          const fallback = spawn("pip3", ["install", "--upgrade", "yt-dlp"]);
          fallback.on("close", (fallbackCode) => {
            if (fallbackCode === 0) resolve({ success: true });
            else
              reject(
                new Error(
                  "Update failed via pip. Please try downloading manually.",
                ),
              );
          });
        } else {
          reject(
            new Error(
              `Update failed (${code}). ${stderr || "Please try downloading manually."}`,
            ),
          );
        }
      }
    });

    child.on("error", (err) => {
      // If our smart-detected command (like 'brew' or 'pip3') isn't found in PATH, fallback to default -U natively
      if (cmd !== ytdlpPath) {
        const fallback = spawn(ytdlpPath, ["-U"]);
        fallback.on("close", (fallbackCode) => {
          if (fallbackCode === 0) resolve({ success: true });
          else reject(new Error(`Update failed. ${err.message}`));
        });
      } else {
        reject(new Error(`Update failed. ${err.message}`));
      }
    });
  });
});
