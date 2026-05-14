/**
 * Renderer Process - UI Logic
 * Handles user interactions and displays video information
 *
 * @license MIT
 */

// Application state
/** @type {string | null} */
let currentVideoUrl = null;
/** @type {string | null} */
let currentThumbnailUrl = null;
let currentVideoTitle = "thumbnail";
/** @type {string | null} */
let selectedFormat = null;
/** @type {string | null} */
let selectedOutputPath = null;
let isDownloading = false;
/** @type {Function | null} */
let progressCleanup = null;

/** @type {HTMLInputElement} */
const urlInput = /** @type {HTMLInputElement} */ (
  document.getElementById("urlInput")
);
/** @type {HTMLButtonElement} */
const fetchBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("fetchBtn")
);
/** @type {HTMLInputElement} */
const headerUrlInput = /** @type {HTMLInputElement} */ (
  document.getElementById("headerUrlInput")
);
/** @type {HTMLButtonElement} */
const headerFetchBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("headerFetchBtn")
);
/** @type {HTMLElement} */
const loading = /** @type {HTMLElement} */ (document.getElementById("loading"));
/** @type {HTMLElement} */
const videoInfo = /** @type {HTMLElement} */ (
  document.getElementById("videoInfo")
);
/** @type {HTMLElement} */
const error = /** @type {HTMLElement} */ (document.getElementById("error"));
/** @type {HTMLElement} */
const formatsList = /** @type {HTMLElement} */ (
  document.getElementById("formatsList")
);
/** @type {HTMLButtonElement} */
const selectFolderBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("selectFolderBtn")
);
/** @type {HTMLInputElement} */
const outputPath = /** @type {HTMLInputElement} */ (
  document.getElementById("outputPath")
);
/** @type {HTMLButtonElement} */
const downloadBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("downloadBtn")
);
/** @type {HTMLButtonElement} */
const cancelBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("cancelBtn")
);
/** @type {HTMLElement} */
const downloadProgress = /** @type {HTMLElement} */ (
  document.getElementById("downloadProgress")
);
/** @type {HTMLElement} */
const progressOutput = /** @type {HTMLElement} */ (
  document.getElementById("progressOutput")
);
/** @type {HTMLButtonElement} */
const downloadThumbnailBtn = /** @type {HTMLButtonElement} */ (
  document.getElementById("downloadThumbnailBtn")
);

// Security: Input sanitization
/**
 * @param {any} input
 * @returns {string}
 */
function sanitizeInput(input) {
  if (typeof input !== "string") return "";
  return input.trim().substring(0, 2000);
}

// Fetch video info function
/**
 * @param {string} url
 * @param {boolean} fromHeader
 */
async function fetchVideoInfo(url, fromHeader = false) {
  const sanitizedUrl = sanitizeInput(url);

  if (!sanitizedUrl) {
    showError("Please enter a YouTube URL");
    return;
  }

  // Basic URL validation
  try {
    new URL(sanitizedUrl);
  } catch {
    showError("Please enter a valid URL");
    return;
  }

  // Switch to main app view if coming from home
  if (!fromHeader) {
    document.getElementById("homeScreen").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");
    // Sync the URL to header input
    headerUrlInput.value = sanitizedUrl;
  }

  hideError();
  hideVideoInfo();
  currentVideoUrl = null;
  currentThumbnailUrl = null;
  currentVideoTitle = "thumbnail";
  resetSelectedFormat();
  showLoading();
  fetchBtn.disabled = true;
  headerFetchBtn.disabled = true;

  try {
    const data = await window.electronAPI.getVideoInfo(sanitizedUrl);
    currentVideoUrl = sanitizedUrl;
    displayVideoInfo(data);
    hideLoading();
  } catch (err) {
    hideLoading();
    showError(
      (err && typeof err === "object" && "error" in err ? err.error : null) ||
        "Failed to fetch video information. Make sure yt-dlp is installed."
    );
  } finally {
    fetchBtn.disabled = false;
    headerFetchBtn.disabled = false;
  }
}

// Home screen fetch button
fetchBtn.addEventListener("click", () => {
  fetchVideoInfo(urlInput.value, false);
});

// Header fetch button
headerFetchBtn.addEventListener("click", () => {
  fetchVideoInfo(headerUrlInput.value, true);
});

// Allow Enter key to fetch video info
urlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !fetchBtn.disabled) {
    fetchBtn.click();
  }
});

// Allow Enter key in header search
headerUrlInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter" && !headerFetchBtn.disabled) {
    headerFetchBtn.click();
  }
});

// Click logo to go back home
document.querySelector("header h1").addEventListener("click", goBackToHome);

// Display video information
/**
 * @param {any} data
 */
function displayVideoInfo(data) {
  // Security: Sanitize all displayed data
  /** @type {HTMLImageElement} */
  const thumbnail = /** @type {HTMLImageElement} */ (
    document.getElementById("thumbnail")
  );
  /** @type {HTMLElement} */
  const title = /** @type {HTMLElement} */ (document.getElementById("title"));
  /** @type {HTMLElement} */
  const channel = /** @type {HTMLElement} */ (
    document.getElementById("channel")
  );
  /** @type {HTMLElement} */
  const duration = /** @type {HTMLElement} */ (
    document.getElementById("duration")
  );
  /** @type {HTMLElement} */
  const views = /** @type {HTMLElement} */ (document.getElementById("views"));
  /** @type {HTMLElement} */
  const likes = /** @type {HTMLElement} */ (document.getElementById("likes"));
  /** @type {HTMLElement} */
  const uploadDate = /** @type {HTMLElement} */ (
    document.getElementById("uploadDate")
  );
  /** @type {HTMLElement} */
  const description = /** @type {HTMLElement} */ (
    document.getElementById("description")
  );
  /** @type {HTMLElement} */
  const tags = /** @type {HTMLElement} */ (document.getElementById("tags"));

  // Validate thumbnail URL
  currentThumbnailUrl = null;
  try {
    const thumbUrl = new URL(data.thumbnail);
    if (thumbUrl.protocol === "https:" || thumbUrl.protocol === "http:") {
      thumbnail.src = data.thumbnail;
      currentThumbnailUrl = data.thumbnail;
    }
  } catch {
    thumbnail.src = "";
  }

  currentVideoTitle = data.title || "thumbnail";
  downloadThumbnailBtn.disabled = !currentThumbnailUrl;

  title.textContent = data.title || "Unknown Title";
  channel.textContent = data.uploader || "Unknown Channel";
  duration.textContent = formatDuration(data.duration);
  views.textContent = formatViews(data.view_count);

  // Handle likes
  if (data.like_count && data.like_count > 0) {
    likes.textContent = formatNumber(data.like_count) + " likes";
    document.getElementById("likesSeparator").style.display = "inline";
  } else {
    likes.textContent = "";
    document.getElementById("likesSeparator").style.display = "none";
  }

  // Handle upload date
  if (data.upload_date) {
    uploadDate.textContent = formatUploadDate(data.upload_date);
    document.getElementById("dateSeparator").style.display = "inline";
  } else {
    uploadDate.textContent = "";
    document.getElementById("dateSeparator").style.display = "none";
  }

  // Handle description
  if (data.description && data.description.trim()) {
    description.textContent = data.description;
    document.getElementById("descriptionSection").style.display = "block";
  } else {
    document.getElementById("descriptionSection").style.display = "none";
  }

  // Handle tags
  if (data.tags && data.tags.length > 0) {
    tags.innerHTML = "";
    data.tags.forEach((tag) => {
      const tagElement = document.createElement("span");
      tagElement.className = "tag";
      tagElement.textContent = tag;
      tags.appendChild(tagElement);
    });
    document.getElementById("tagsSection").style.display = "block";
  } else {
    document.getElementById("tagsSection").style.display = "none";
  }

  displayFormats(data.formats || []);
  videoInfo.classList.remove("hidden");
}

// Toggle description
document
  .getElementById("descriptionToggle")
  .addEventListener("click", function () {
    /** @type {HTMLElement} */
    const description = /** @type {HTMLElement} */ (
      document.getElementById("description")
    );
    const toggle = /** @type {HTMLElement} */ (this);
    const isHidden = description.classList.contains("hidden");

    if (isHidden) {
      description.classList.remove("hidden");
      toggle.querySelector("span").textContent = "Hide Description";
      toggle.classList.add("expanded");
    } else {
      description.classList.add("hidden");
      toggle.querySelector("span").textContent = "Show Description";
      toggle.classList.remove("expanded");
    }
  });

// Display available formats
/**
 * @param {any[]} formats
 */
function displayFormats(formats) {
  formatsList.innerHTML = "";
  resetSelectedFormat();

  // Filter and sort formats
  const videoFormats = formats.filter(
    (f) => f.vcodec !== "none" && f.acodec !== "none"
  );
  const audioFormats = formats.filter(
    (f) => f.vcodec === "none" && f.acodec !== "none"
  );

  if (videoFormats.length > 0) {
    addFormatSection("Video + Audio", videoFormats);
  }

  if (audioFormats.length > 0) {
    addFormatSection("Audio Only", audioFormats);
  }

  if (videoFormats.length === 0 && audioFormats.length === 0) {
    const emptyState = document.createElement("div");
    emptyState.className = "empty-state";
    emptyState.textContent = "No downloadable formats were found.";
    formatsList.appendChild(emptyState);
  }
}

/**
 * @param {string} title
 * @param {any[]} formats
 */
function addFormatSection(title, formats) {
  const section = document.createElement("div");
  section.className = "format-section-header";
  section.textContent = title;
  formatsList.appendChild(section);

  formats.forEach((format) => {
    const item = document.createElement("div");
    item.className = "format-item";
    item.dataset.formatId = format.format_id;

    const info = document.createElement("div");
    info.className = "format-info";

    const type = document.createElement("div");
    type.className = "format-type";
    type.textContent = format.format_note || format.format;

    const details = document.createElement("div");
    details.className = "format-details";
    const resolution = format.resolution || "audio";
    const ext = format.ext || "unknown";
    const fps = format.fps ? ` ${format.fps}fps` : "";
    details.textContent = `${resolution} - ${ext}${fps}`;

    info.appendChild(type);
    info.appendChild(details);

    const size = document.createElement("div");
    size.className = "format-size";
    size.textContent = format.filesize
      ? formatBytes(format.filesize)
      : format.filesize_approx
      ? `~${formatBytes(format.filesize_approx)}`
      : "Size unknown";

    item.appendChild(info);
    item.appendChild(size);

    item.addEventListener("click", () => selectFormat(item, format));

    formatsList.appendChild(item);
  });
}

// Select format
/**
 * @param {HTMLElement} element
 * @param {any} format
 */
function selectFormat(element, format) {
  document.querySelectorAll(".format-item").forEach((item) => {
    item.classList.remove("selected");
  });

  element.classList.add("selected");
  selectedFormat = format.format_id;
  updateDownloadButton();
}

function resetSelectedFormat() {
  selectedFormat = null;
  document.querySelectorAll(".format-item").forEach((item) => {
    item.classList.remove("selected");
  });
  updateDownloadButton();
}

downloadThumbnailBtn.addEventListener("click", async () => {
  if (!currentThumbnailUrl || downloadThumbnailBtn.disabled) return;

  downloadThumbnailBtn.disabled = true;
  hideError();

  try {
    const result = await window.electronAPI.downloadThumbnail({
      url: currentThumbnailUrl,
      title: currentVideoTitle,
      outputPath: selectedOutputPath,
    });

    if (result && result.canceled) {
      return;
    }
  } catch (err) {
    showError(
      (err && typeof err === "object" && "error" in err ? err.error : null) ||
        "Failed to download thumbnail."
    );
  } finally {
    downloadThumbnailBtn.disabled = !currentThumbnailUrl;
  }
});

// Select output folder
selectFolderBtn.addEventListener("click", async () => {
  try {
    const folder = await window.electronAPI.selectFolder();
    if (folder) {
      selectedOutputPath = folder;
      outputPath.value = folder;
      updateDownloadButton();
    }
  } catch (err) {
    showError(
      (err && typeof err === "object" && "error" in err ? err.error : null) ||
        "Unable to select that folder."
    );
  }
});

// Update download button state
function updateDownloadButton() {
  downloadBtn.disabled = !(selectedFormat && selectedOutputPath);
}

// Download video
downloadBtn.addEventListener("click", async () => {
  if (!currentVideoUrl || !selectedFormat || !selectedOutputPath || isDownloading) {
    return;
  }

  isDownloading = true;
  downloadBtn.disabled = true;
  cancelBtn.classList.remove("hidden");
  downloadProgress.classList.remove("hidden");
  progressOutput.textContent = "Starting download...\n";

  // Setup progress listener
  progressCleanup = window.electronAPI.onDownloadProgress((data) => {
    progressOutput.textContent += data;
    progressOutput.scrollTop = progressOutput.scrollHeight;
  });

  try {
    await window.electronAPI.downloadVideo({
      url: currentVideoUrl,
      formatId: selectedFormat,
      outputPath: selectedOutputPath,
    });

    if (isDownloading) {
      progressOutput.textContent += "\nDownload completed successfully.";
    }
  } catch (err) {
    if (isDownloading) {
      progressOutput.textContent += `\nError: ${
      (err && typeof err === "object" && "error" in err ? err.error : null) ||
        "Unknown error"
      }`;
    }
  } finally {
    isDownloading = false;
    downloadBtn.disabled = false;
    cancelBtn.classList.add("hidden");

    // Cleanup progress listener
    if (progressCleanup) {
      progressCleanup();
      progressCleanup = null;
    }
  }
});

// Cancel download
cancelBtn.addEventListener("click", async () => {
  if (!isDownloading) return;

  try {
    await window.electronAPI.cancelDownload();
    progressOutput.textContent += "\nDownload cancelled by user.";
    isDownloading = false;
    downloadBtn.disabled = false;
    cancelBtn.classList.add("hidden");

    if (progressCleanup) {
      progressCleanup();
      progressCleanup = null;
    }
  } catch (err) {
    progressOutput.textContent += `\nError cancelling: ${
      (err && typeof err === "object" && "error" in err ? err.error : null) ||
        "Unknown error"
    }`;
  }
});

// Utility functions
/**
 * @param {number} seconds
 * @returns {string}
 */
function formatDuration(seconds) {
  if (!seconds) return "Unknown";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * @param {number} bytes
 * @returns {string}
 */
function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "Size unknown";
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * @param {number} count
 * @returns {string}
 */
function formatViews(count) {
  if (!count || count === 0) return "0 views";
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M views";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K views";
  }
  return count.toLocaleString() + " views";
}

/**
 * @param {number} num
 * @returns {string}
 */
function formatNumber(num) {
  if (!num || num === 0) return "0";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

/**
 * @param {string} dateString
 * @returns {string}
 */
function formatUploadDate(dateString) {
  if (!dateString) return "";
  // Format: YYYYMMDD
  const year = parseInt(dateString.substring(0, 4), 10);
  const month = parseInt(dateString.substring(4, 6), 10);
  const day = parseInt(dateString.substring(6, 8), 10);

  const date = new Date(year, month - 1, day);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 7) {
    return diffDays === 1 ? "1 day ago" : diffDays + " days ago";
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? "1 week ago" : weeks + " weeks ago";
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? "1 month ago" : months + " months ago";
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? "1 year ago" : years + " years ago";
  }
}

function showLoading() {
  loading.classList.remove("hidden");
}

function hideLoading() {
  loading.classList.add("hidden");
}

/**
 * @param {string} message
 */
function showError(message) {
  error.textContent = message;
  error.classList.remove("hidden");
}

function hideError() {
  error.classList.add("hidden");
}

function hideVideoInfo() {
  videoInfo.classList.add("hidden");
  downloadProgress.classList.add("hidden");
}

// Add back button functionality
function goBackToHome() {
  document.getElementById("homeScreen").classList.remove("hidden");
  document.getElementById("mainApp").classList.add("hidden");
  urlInput.value = "";
  headerUrlInput.value = "";
  currentVideoUrl = null;
  currentThumbnailUrl = null;
  currentVideoTitle = "thumbnail";
  downloadThumbnailBtn.disabled = true;
  resetSelectedFormat();
  hideVideoInfo();
  hideError();
  hideLoading();
}
