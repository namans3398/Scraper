# Frequently Asked Questions (FAQ)

## General Questions

### What is Scraper?
Scraper is a free, open-source desktop application for downloading YouTube videos. It provides a secure, user-friendly interface for yt-dlp, allowing you to download videos in various formats and qualities.

### Is Scraper free?
Yes! Scraper is completely free and open-source under the MIT License. You can use, modify, and distribute it freely.

### What platforms does Scraper support?
Scraper works on:
- macOS 10.13 and later
- Windows 10 and later
- Linux (64-bit distributions)

### Is Scraper safe to use?
Yes. Scraper is built with security as a priority:
- All code is open-source and auditable
- Implements comprehensive input validation
- Prevents command injection and XSS attacks
- Uses sandboxed processes
- No data collection or telemetry

## Installation & Setup

### Do I need to install anything else?
Yes, you need:
1. **Node.js** (v20 or higher) - only if running from source
2. **yt-dlp** - required for downloading videos

See [INSTALL.md](INSTALL.md) for detailed instructions.

### How do I install yt-dlp?
The easiest methods:
- **macOS**: `brew install yt-dlp`
- **Windows**: `pip install yt-dlp`
- **Linux**: `pip3 install yt-dlp`

See [INSTALL.md](INSTALL.md#2-yt-dlp-required) for all installation methods.

### Why does it say "yt-dlp not found"?
This means yt-dlp isn't installed or not in your system PATH. Install it using the methods above, then restart your terminal and the app.

## Usage

### What video sites are supported?
Scraper uses yt-dlp, which supports YouTube and many other sites. However, this app is primarily designed and tested for YouTube.

### Can I download playlists?
Not in version 1.0.0. Playlist support is planned for a future release.

### What video formats can I download?
You can download:
- Video + Audio combined (various resolutions: 4K, 1080p, 720p, etc.)
- Audio only (various bitrates)
- Different codecs (VP9, AVC, etc.)

The available formats depend on what YouTube provides for each video.

### Where are videos saved?
Videos are saved to the folder you select using the "Browse" button. You can choose any writable folder on your computer.

### Can I change the filename?
Currently, videos are saved with their original YouTube title. Custom filename templates are planned for a future release.

### How do I cancel a download?
Click the "Cancel" button that appears during download. The download will stop, but partially downloaded files may remain in your download folder.

## Troubleshooting

### The app won't start
1. Verify Node.js is installed: `node --version`
2. Try reinstalling dependencies: `npm install`
3. Check for error messages in the terminal
4. See [INSTALL.md](INSTALL.md#troubleshooting)

### Downloads are very slow
- Check your internet connection speed
- Try a lower quality format
- Close other applications using bandwidth
- Update yt-dlp: `pip install --upgrade yt-dlp`

### "Permission denied" error
- Choose a different download folder (Desktop, Documents, Downloads)
- Check folder permissions
- Don't select system folders or protected directories

### Video format not available
Some videos don't have all formats available. Try:
- Selecting a different format
- Choosing "Audio Only" if video formats fail
- Checking if the video is available in your region

### Download fails immediately
- Verify the YouTube URL is correct and accessible
- Check if the video is private or restricted
- Update yt-dlp: `pip install --upgrade yt-dlp`
- Try the URL in a web browser first

### "Failed to fetch video information"
- Check your internet connection
- Verify the URL is a valid YouTube link
- The video might be unavailable or deleted
- Update yt-dlp to the latest version

## Legal & Ethics

### Is it legal to download YouTube videos?
This depends on:
- Your country's copyright laws
- YouTube's Terms of Service
- The video's license and permissions
- Your intended use

**We recommend:**
- Only download videos you have permission to download
- Respect copyright and creator rights
- Use for personal, non-commercial purposes only
- Follow YouTube's Terms of Service

### Can I download copyrighted content?
Downloading copyrighted content without permission may violate copyright laws and YouTube's Terms of Service. Use this tool responsibly and legally.

### Will my YouTube account be banned?
Scraper doesn't interact with your YouTube account. However, downloading videos may violate YouTube's Terms of Service. Use at your own discretion.

## Technical Questions

### How does Scraper work?
Scraper is an Electron app that provides a GUI for yt-dlp:
1. You provide a YouTube URL
2. Scraper calls yt-dlp to fetch video information
3. You select a format
4. Scraper calls yt-dlp to download the video
5. Progress is displayed in real-time

### Does Scraper collect any data?
No. Scraper:
- Doesn't collect any user data
- Doesn't send analytics or telemetry
- Doesn't track your downloads
- Doesn't require an account
- Works completely offline (after fetching video info)

### Why does it need internet access?
Internet access is only needed to:
- Fetch video information from YouTube
- Download videos
- Update yt-dlp (manual)

No data is sent to any servers except YouTube.

### Can I use Scraper offline?
No, you need internet to fetch video information and download videos. However, the app itself doesn't require internet to start.

### How do I update Scraper?
- **Pre-built apps**: Download the latest version from [Releases](https://github.com/namans3398/Scraper/releases)
- **From source**: `git pull && npm install`

### How do I update yt-dlp?
```bash
pip install --upgrade yt-dlp
```

It's recommended to keep yt-dlp updated for best compatibility.

## Development

### Can I contribute to Scraper?
Yes! Contributions are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### How do I report bugs?
Open an issue on [GitHub Issues](https://github.com/namans3398/Scraper/issues) with:
- Description of the bug
- Steps to reproduce
- Your OS and versions
- Error messages

### How do I request features?
Open a feature request on [GitHub Issues](https://github.com/namans3398/Scraper/issues) describing:
- The feature you'd like
- Why it would be useful
- How it should work

### Can I modify the code?
Yes! Scraper is open-source under the MIT License. You can:
- Modify the code for personal use
- Fork the project
- Create your own version
- Contribute improvements back

## Support

### Where can I get help?
- Read the [README](README.md)
- Check [INSTALL.md](INSTALL.md) for setup help
- Search [existing issues](https://github.com/namans3398/Scraper/issues)
- Ask in [Discussions](https://github.com/namans3398/Scraper/discussions)
- Open a [new issue](https://github.com/namans3398/Scraper/issues/new)

### How do I contact the developers?
- GitHub Issues for bugs and features
- GitHub Discussions for questions
- Follow the reporting process in [SECURITY.md](SECURITY.md)

## Miscellaneous

### Why "Scraper"?
The name reflects the app's purpose: scraping (extracting) video information and content from YouTube.

### What's planned for future versions?
See [CHANGELOG.md](CHANGELOG.md) for planned features, including:
- Playlist support
- Download queue
- Custom filename templates
- Subtitle downloads
- And more!

### How can I support the project?
- ⭐ Star the repository on GitHub
- 🐛 Report bugs and issues
- 💡 Suggest features
- 🔧 Contribute code
- 📖 Improve documentation
- 💬 Help others in Discussions
- ☕ Sponsor the project (if funding is set up)

---

**Didn't find your answer?** Open an issue or discussion on GitHub!
