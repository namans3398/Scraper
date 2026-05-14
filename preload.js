/**
 * Preload Script - Secure Bridge
 * Provides a secure, validated API bridge between main and renderer processes
 *
 * @license MIT
 */

const { contextBridge, ipcRenderer } = require("electron");

// Security: Expose only specific, validated APIs to renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * @param {string} url
   */
  getVideoInfo: (url) => {
    // Validate input before sending to main process
    if (typeof url !== "string" || url.length > 2000) {
      return Promise.reject({ error: "Invalid URL format" });
    }
    return ipcRenderer.invoke("get-video-info", url);
  },

  selectFolder: () => ipcRenderer.invoke("select-folder"),

  /**
   * @param {object} data
   */
  downloadThumbnail: (data) => {
    if (!data || typeof data !== "object") {
      return Promise.reject({ error: "Invalid thumbnail data" });
    }
    if (
      typeof data.url !== "string" ||
      typeof data.title !== "string" ||
      (data.outputPath !== null &&
        data.outputPath !== undefined &&
        typeof data.outputPath !== "string")
    ) {
      return Promise.reject({ error: "Invalid thumbnail parameters" });
    }
    return ipcRenderer.invoke("download-thumbnail", data);
  },

  /**
   * @param {object} data
   */
  downloadVideo: (data) => {
    // Validate input structure
    if (!data || typeof data !== "object") {
      return Promise.reject({ error: "Invalid download data" });
    }
    if (
      typeof data.url !== "string" ||
      typeof data.formatId !== "string" ||
      typeof data.outputPath !== "string"
    ) {
      return Promise.reject({ error: "Invalid download parameters" });
    }
    return ipcRenderer.invoke("download-video", data);
  },

  cancelDownload: () => ipcRenderer.invoke("cancel-download"),

  /**
   * @param {Function} callback
   */
  onDownloadProgress: (callback) => {
    // Security: Validate callback is a function
    if (typeof callback !== "function") {
      throw new Error("Callback must be a function");
    }

    /** @param {any} event @param {string} data */
    const subscription = (event, data) => {
      // Sanitize data before passing to callback
      if (typeof data === "string") {
        callback(data);
      }
    };

    ipcRenderer.on("download-progress", subscription);

    // Return cleanup function
    return () => {
      ipcRenderer.removeListener("download-progress", subscription);
    };
  },
});
