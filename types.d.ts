// Type definitions for the Electron app

interface ElectronAPI {
  getVideoInfo: (url: string) => Promise<any>;
  selectFolder: () => Promise<string | null>;
  downloadThumbnail: (data: {
    url: string;
    title: string;
    outputPath?: string | null;
  }) => Promise<{ success: boolean; canceled?: boolean; path?: string }>;
  downloadVideo: (data: {
    url: string;
    formatId: string;
    outputPath: string;
  }) => Promise<{ success: boolean }>;
  cancelDownload: () => Promise<{ success: boolean }>;
  checkDependencies: () => Promise<{
    ytdlp: boolean;
    ffmpeg: boolean;
    ytdlpOutdated: boolean;
    ytdlpPath?: string;
    ffmpegPath?: string;
    ytdlpVersion?: string;
    latestYtDlpVersion?: string | null;
    configuredDependencyPath?: string | null;
  }>;
  downloadDependencies: (location: string) => Promise<{
    success: boolean;
    message: string;
  }>;
  updateDependencies: () => Promise<{ success: boolean }>;

  onDownloadProgress: (callback: (data: string) => void) => () => void;
}

interface Window {
  electronAPI: ElectronAPI;
}
