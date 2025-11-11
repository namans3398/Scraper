// Type definitions for the Electron app

interface ElectronAPI {
  getVideoInfo: (url: string) => Promise<any>;
  selectFolder: () => Promise<string | null>;
  downloadVideo: (data: {
    url: string;
    formatId: string;
    outputPath: string;
  }) => Promise<{ success: boolean }>;
  cancelDownload: () => Promise<{ success: boolean }>;
  onDownloadProgress: (callback: (data: string) => void) => () => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
