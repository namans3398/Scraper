let currentVideoData = null;
let selectedFormat = null;
let selectedOutputPath = null;
let isDownloading = false;
let progressCleanup = null;

const urlInput = document.getElementById('urlInput');
const fetchBtn = document.getElementById('fetchBtn');
const headerUrlInput = document.getElementById('headerUrlInput');
const headerFetchBtn = document.getElementById('headerFetchBtn');
const loading = document.getElementById('loading');
const videoInfo = document.getElementById('videoInfo');
const error = document.getElementById('error');
const formatsList = document.getElementById('formatsList');
const selectFolderBtn = document.getElementById('selectFolderBtn');
const outputPath = document.getElementById('outputPath');
const downloadBtn = document.getElementById('downloadBtn');
const cancelBtn = document.getElementById('cancelBtn');
const downloadProgress = document.getElementById('downloadProgress');
const progressOutput = document.getElementById('progressOutput');

// Security: Input sanitization
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return input.trim().substring(0, 2000);
}

// Security: Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Fetch video info function
async function fetchVideoInfo(url, fromHeader = false) {
  const sanitizedUrl = sanitizeInput(url);
  
  if (!sanitizedUrl) {
    showError('Please enter a YouTube URL');
    return;
  }
  
  // Basic URL validation
  try {
    new URL(sanitizedUrl);
  } catch {
    showError('Please enter a valid URL');
    return;
  }
  
  // Switch to main app view if coming from home
  if (!fromHeader) {
    document.getElementById('homeScreen').classList.add('hidden');
    document.getElementById('mainApp').classList.remove('hidden');
    // Sync the URL to header input
    headerUrlInput.value = sanitizedUrl;
  }
  
  hideError();
  hideVideoInfo();
  showLoading();
  fetchBtn.disabled = true;
  headerFetchBtn.disabled = true;
  
  try {
    const data = await window.electronAPI.getVideoInfo(sanitizedUrl);
    currentVideoData = data;
    displayVideoInfo(data);
    hideLoading();
  } catch (err) {
    hideLoading();
    showError(err.error || 'Failed to fetch video information. Make sure yt-dlp is installed.');
  } finally {
    fetchBtn.disabled = false;
    headerFetchBtn.disabled = false;
  }
}

// Home screen fetch button
fetchBtn.addEventListener('click', () => {
  fetchVideoInfo(urlInput.value, false);
});

// Header fetch button
headerFetchBtn.addEventListener('click', () => {
  fetchVideoInfo(headerUrlInput.value, true);
});

// Allow Enter key to fetch video info
urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !fetchBtn.disabled) {
    fetchBtn.click();
  }
});

// Allow Enter key in header search
headerUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && !headerFetchBtn.disabled) {
    headerFetchBtn.click();
  }
});

// Click logo to go back home
document.querySelector('header h1').addEventListener('click', goBackToHome);

// Display video information
function displayVideoInfo(data) {
  // Security: Sanitize all displayed data
  const thumbnail = document.getElementById('thumbnail');
  const title = document.getElementById('title');
  const channel = document.getElementById('channel');
  const duration = document.getElementById('duration');
  const views = document.getElementById('views');
  const likes = document.getElementById('likes');
  const uploadDate = document.getElementById('uploadDate');
  const description = document.getElementById('description');
  const tags = document.getElementById('tags');
  
  // Validate thumbnail URL
  try {
    const thumbUrl = new URL(data.thumbnail);
    if (thumbUrl.protocol === 'https:' || thumbUrl.protocol === 'http:') {
      thumbnail.src = data.thumbnail;
    }
  } catch {
    thumbnail.src = '';
  }
  
  title.textContent = data.title || 'Unknown Title';
  channel.textContent = data.uploader || 'Unknown Channel';
  duration.textContent = formatDuration(data.duration);
  views.textContent = formatViews(data.view_count);
  
  // Handle likes
  if (data.like_count && data.like_count > 0) {
    likes.textContent = formatNumber(data.like_count) + ' likes';
    document.getElementById('likesSeparator').style.display = 'inline';
  } else {
    likes.textContent = '';
    document.getElementById('likesSeparator').style.display = 'none';
  }
  
  // Handle upload date
  if (data.upload_date) {
    uploadDate.textContent = formatUploadDate(data.upload_date);
    document.getElementById('dateSeparator').style.display = 'inline';
  } else {
    uploadDate.textContent = '';
    document.getElementById('dateSeparator').style.display = 'none';
  }
  
  // Handle description
  if (data.description && data.description.trim()) {
    description.textContent = data.description;
    document.getElementById('descriptionSection').style.display = 'block';
  } else {
    document.getElementById('descriptionSection').style.display = 'none';
  }
  
  // Handle tags
  if (data.tags && data.tags.length > 0) {
    tags.innerHTML = '';
    data.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      tags.appendChild(tagElement);
    });
    document.getElementById('tagsSection').style.display = 'block';
  } else {
    document.getElementById('tagsSection').style.display = 'none';
  }
  
  displayFormats(data.formats || []);
  videoInfo.classList.remove('hidden');
}

// Toggle description
document.getElementById('descriptionToggle').addEventListener('click', function() {
  const description = document.getElementById('description');
  const toggle = this;
  const isHidden = description.classList.contains('hidden');
  
  if (isHidden) {
    description.classList.remove('hidden');
    toggle.querySelector('span').textContent = 'Hide Description';
    toggle.classList.add('expanded');
  } else {
    description.classList.add('hidden');
    toggle.querySelector('span').textContent = 'Show Description';
    toggle.classList.remove('expanded');
  }
});

// Display available formats
function displayFormats(formats) {
  formatsList.innerHTML = '';
  
  // Filter and sort formats
  const videoFormats = formats.filter(f => f.vcodec !== 'none' && f.acodec !== 'none');
  const audioFormats = formats.filter(f => f.vcodec === 'none' && f.acodec !== 'none');
  
  if (videoFormats.length > 0) {
    addFormatSection('Video + Audio', videoFormats);
  }
  
  if (audioFormats.length > 0) {
    addFormatSection('Audio Only', audioFormats);
  }
}

function addFormatSection(title, formats) {
  const section = document.createElement('div');
  section.className = 'format-section-header';
  section.textContent = title;
  formatsList.appendChild(section);
  
  formats.forEach(format => {
    const item = document.createElement('div');
    item.className = 'format-item';
    item.dataset.formatId = format.format_id;
    
    const info = document.createElement('div');
    info.className = 'format-info';
    
    const type = document.createElement('div');
    type.className = 'format-type';
    type.textContent = format.format_note || format.format;
    
    const details = document.createElement('div');
    details.className = 'format-details';
    const resolution = format.resolution || 'audio';
    const ext = format.ext || 'unknown';
    const fps = format.fps ? ` ${format.fps}fps` : '';
    details.textContent = `${resolution} • ${ext}${fps}`;
    
    info.appendChild(type);
    info.appendChild(details);
    
    const size = document.createElement('div');
    size.className = 'format-size';
    size.textContent = format.filesize ? formatBytes(format.filesize) : 
                       format.filesize_approx ? `~${formatBytes(format.filesize_approx)}` : 
                       'Size unknown';
    
    item.appendChild(info);
    item.appendChild(size);
    
    item.addEventListener('click', () => selectFormat(item, format));
    
    formatsList.appendChild(item);
  });
}

// Select format
function selectFormat(element, format) {
  document.querySelectorAll('.format-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  element.classList.add('selected');
  selectedFormat = format.format_id;
  updateDownloadButton();
}

// Select output folder
selectFolderBtn.addEventListener('click', async () => {
  const folder = await window.electronAPI.selectFolder();
  if (folder) {
    selectedOutputPath = folder;
    outputPath.value = folder;
    updateDownloadButton();
  }
});

// Update download button state
function updateDownloadButton() {
  downloadBtn.disabled = !(selectedFormat && selectedOutputPath);
}

// Download video
downloadBtn.addEventListener('click', async () => {
  if (!selectedFormat || !selectedOutputPath || isDownloading) return;
  
  isDownloading = true;
  downloadBtn.disabled = true;
  cancelBtn.classList.remove('hidden');
  downloadProgress.classList.remove('hidden');
  progressOutput.textContent = 'Starting download...\n';
  
  // Setup progress listener
  progressCleanup = window.electronAPI.onDownloadProgress((data) => {
    // Security: Sanitize progress output
    const sanitized = escapeHtml(data);
    progressOutput.textContent += sanitized;
    progressOutput.scrollTop = progressOutput.scrollHeight;
  });
  
  try {
    await window.electronAPI.downloadVideo({
      url: sanitizeInput(urlInput.value),
      formatId: selectedFormat,
      outputPath: selectedOutputPath
    });
    
    progressOutput.textContent += '\n✓ Download completed successfully!';
  } catch (err) {
    progressOutput.textContent += `\n✗ Error: ${escapeHtml(err.error || 'Unknown error')}`;
  } finally {
    isDownloading = false;
    downloadBtn.disabled = false;
    cancelBtn.classList.add('hidden');
    
    // Cleanup progress listener
    if (progressCleanup) {
      progressCleanup();
      progressCleanup = null;
    }
  }
});

// Cancel download
cancelBtn.addEventListener('click', async () => {
  if (!isDownloading) return;
  
  try {
    await window.electronAPI.cancelDownload();
    progressOutput.textContent += '\n⚠ Download cancelled by user';
    isDownloading = false;
    downloadBtn.disabled = false;
    cancelBtn.classList.add('hidden');
    
    if (progressCleanup) {
      progressCleanup();
      progressCleanup = null;
    }
  } catch (err) {
    progressOutput.textContent += `\n✗ Error cancelling: ${escapeHtml(err.error || 'Unknown error')}`;
  }
});

// Utility functions
function formatDuration(seconds) {
  if (!seconds) return 'Unknown';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatViews(count) {
  if (!count || count === 0) return '0 views';
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M views';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K views';
  }
  return count.toLocaleString() + ' views';
}

function formatNumber(num) {
  if (!num || num === 0) return '0';
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toLocaleString();
}

function formatUploadDate(dateString) {
  if (!dateString) return '';
  // Format: YYYYMMDD
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  
  const date = new Date(year, month - 1, day);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 7) {
    return diffDays === 1 ? '1 day ago' : diffDays + ' days ago';
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return weeks === 1 ? '1 week ago' : weeks + ' weeks ago';
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return months === 1 ? '1 month ago' : months + ' months ago';
  } else {
    const years = Math.floor(diffDays / 365);
    return years === 1 ? '1 year ago' : years + ' years ago';
  }
}

function showLoading() {
  loading.classList.remove('hidden');
}

function hideLoading() {
  loading.classList.add('hidden');
}

function showError(message) {
  error.textContent = message;
  error.classList.remove('hidden');
}

function hideError() {
  error.classList.add('hidden');
}

function hideVideoInfo() {
  videoInfo.classList.add('hidden');
  downloadProgress.classList.add('hidden');
}

// Add back button functionality
function goBackToHome() {
  document.getElementById('homeScreen').classList.remove('hidden');
  document.getElementById('mainApp').classList.add('hidden');
  urlInput.value = '';
  headerUrlInput.value = '';
  hideVideoInfo();
  hideError();
  hideLoading();
}
