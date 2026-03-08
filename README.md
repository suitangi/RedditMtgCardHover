# Reddit MTG Card Hover

<p align="center">
  <img src="https://raw.githubusercontent.com/suitangi/RedditMtgCardHover/master/docs/img/icon.png" alt="Extension Icon" width="128">
</p>

<p align="center">
  <strong>A lightweight browser extension that adds hover card previews for Reddit's u/MtgCardFetcher bot</strong>
</p>

<p align="center">
  <a href="https://github.com/suitangi/RedditMtgCardHover/releases/latest">
    <img src="https://img.shields.io/github/v/release/suitangi/RedditMtgCardHover?style=for-the-badge&logo=github" alt="Latest Release">
  </a>
  <a href="https://github.com/suitangi/RedditMtgCardHover/stargazers">
    <img src="https://img.shields.io/github/stars/suitangi/RedditMtgCardHover?style=for-the-badge&logo=github" alt="Stars">
  </a>
</p>


## Features

- **Instant Card Previews** - Hover over MTGCardFetcher links to see card images
- **Smart Positioning** - Cards auto-position to stay within viewport
- **Resizable Cards** - Drag the corner to resize cards to your preference  
- **Universal Reddit Support** - Works on both new Reddit and old Reddit
- **Privacy First** - No data collection, minimal permissions
- **Lightweight** - Fast and efficient with minimal resource usage

![Demo GIF](https://raw.githubusercontent.com/suitangi/RedditMtgCardHover/master/docs/img/drag.gif)
## Installation

### Option 1: Browser Extension Stores

- **Firefox**: [Install from Firefox Add-ons](https://addons.mozilla.org/en-US/firefox/addon/reddit-mtgcardfetcher-hover/)
- **Chrome**: [Install from Chrome Web Store](https://chromewebstore.google.com/detail/reddit-mtgcardfetcher-hov/lgolghfbfjpegcdaneojpnaccppdacbi)

### Option 2: Manual Installation (Developer)

1. **Download the latest release:**
   ```bash
   git clone https://github.com/suitangi/RedditMtgCardHover.git
   ```
   OR [Download ZIP](https://github.com/suitangi/RedditMtgCardHover/archive/refs/heads/master.zip)

2. **Choose your browser:**

   **Firefox**
   ```bash
   cd firefox-extension
   npm install
   npm run build
   ```
   - Open Firefox → `about:debugging` → "This Firefox" → "Load Temporary Add-on"
   - Select the built `.xpi` file from `web-ext-artifacts/`

   **Chrome**
   ```bash
   cd chrome-extension
   npm install  
   npm run dev
   ```
   - Open Chrome → `chrome://extensions/` → Enable "Developer mode" → "Load unpacked"
   - Select the `dist/` folder

### Option 3: Self-Signed Firefox Extension

For Firefox users who want a signed extension for permanent installation:
1. See [Firefox Signing Instructions](firefox-extension/SIGNING.md)
2. Download signed `.xpi` from releases

## Usage

1. **Navigate** to any Magic: The Gathering subreddit
2. **Look** for MTGCardFetcher bot comments
3. **Hover** over card name links to see card images
4. **Drag** the bottom-right corner to resize cards
5. **Double-click** cards to open Scryfall page

### Supported Subreddits

Works on **80+ Magic subreddits** including:
```
r/magicTCG, r/EDH, r/ModernMagic, r/CompetitiveEDH, r/mtgfinance, 
r/spikes, r/custommagic, r/budgetdecks, r/pauper, r/Pioneer, 
r/mtgcube, r/mtgbrawl, and many more!
```

Missing a subreddit? [Open an issue](https://github.com/suitangi/RedditMtgCardHover/issues) to get it added!

## Development

### Prerequisites
- Node.js 14+ 
- Firefox or Chrome browser

### Build Instructions

**Firefox Extension:**
```bash
cd firefox-extension
npm install
npm run build    # Creates signed package
npm run dev      # Development mode
npm run lint     # Check for issues
```

**Chrome Extension:**
```bash
cd chrome-extension  
npm install
npm run build    # Creates ZIP for Web Store
npm run dev      # Development testing
```

## Special Thanks

- **Beta Tester**: [G-Jayakar](https://github.com/G-Jayakar)
- **MTGCardFetcher Bot**: For making this extension possible
- **Scryfall**: For providing the card images


## Disclaimer

This extension is a third-party project and has **no affiliation** with:
- Reddit, Inc.
- Wizards of the Coast
- Scryfall
- The MTGCardFetcher bot

This is a free, open-source project that enhances your Reddit browsing experience.

---

<p align="center">
  <strong>Enjoying the extension? Give it a ⭐ on GitHub!</strong>
</p>

## Change Log
```
v2.0.0 Updated to manifest 3, removed popup and options, added double click to Scryfall and bottom right corner resizing
v1.2.3 Icon update and major fixes for new Reddit layout.
v1.2.2 More bug fixes.
v1.2.1 Bug fixes with options and hovering.
v1.2.0 Major adjustments and hover is over mouse position now.
v1.1.0 First stable release with hover fixed on screen.
```
