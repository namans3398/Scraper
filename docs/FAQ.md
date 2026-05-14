# Frequently Asked Questions

## What is Scraper?

Scraper is an open-source Electron desktop app that provides a graphical interface for `yt-dlp`.

## Which platforms are supported?

The first production-ready release is macOS-first. Windows and Linux package targets exist for contributor testing, but they are experimental until validated and signed.

## Does Scraper include `yt-dlp` or `ffmpeg`?

Scraper can use tools installed on your system or in a user-selected dependency folder. `yt-dlp` is required for metadata and downloads. `ffmpeg` is required when a selected format needs merging.

## Why did metadata fetching or downloading fail?

Common causes are an outdated `yt-dlp`, a private or unavailable URL, network failure, missing `ffmpeg`, or a non-writable output folder. Update `yt-dlp` first because extractor fixes are released frequently.

## Where are downloads saved?

Downloads are saved to the output folder selected in the app before starting the download.

## Why does macOS warn me before opening the app?

Current draft release artifacts are unsigned. macOS may block or warn on first launch. Only use builds from the official repository, review the source if needed, and approve the app manually only if you trust the artifact.

## Does Scraper collect telemetry?

No. Scraper does not include analytics, telemetry, or trackers.

## Can I use Scraper with any website?

The current app validates YouTube URLs. Use Scraper only with content you have the right to access and download, and follow applicable website terms and law.
