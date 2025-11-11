const { contextBridge, ipcRenderer } = require('electron');

// Security: Expose only specific, validated APIs to renderer
contextBridge.exposeInMainWorld('electronAPI', {
  getVideoInfo: (url) => {
    // Validate input before sending to main process
    if (typeof url !== 'string' || url.length > 2000) {
      return Promise.reject({ error: 'Invalid URL format' });
    }
    return ipcRenderer.invoke('get-video-info', url);
  },
  
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  
  downloadVideo: (data) => {
    // Validate input structure
    if (!data || typeof data !== 'object') {
      return Promise.reject({ error: 'Invalid download data' });
    }
    if (typeof data.url !== 'string' || typeof data.formatId !== 'string' || typeof data.outputPath !== 'string') {
      return Promise.reject({ error: 'Invalid download parameters' });
    }
    return ipcRenderer.invoke('download-video', data);
  },
  
  cancelDownload: () => ipcRenderer.invoke('cancel-download'),
  
  onDownloadProgress: (callback) => {
    // Security: Validate callback is a function
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }
    
    const subscription = (event, data) => {
      // Sanitize data before passing to callback
      if (typeof data === 'string') {
        callback(data);
      }
    };
    
    ipcRenderer.on('download-progress', subscription);
    
    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('download-progress', subscription);
    };
  }
});
