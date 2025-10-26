# Mira Safe Web

A Chrome extension that protects users from phishing and typosquatting attacks by analysing domains in real-time and providing instant visual feedback. This project was built as a learning experiment using Windsurf AI as a tutor to learn Chrome extension development.

**Important disclaimer**: This extension is an experimental project built for learning purposes. While it achieves 94.3% detection accuracy in testing, it should not be considered a complete security solution. Always verify URLs manually when entering sensitive information.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)

&nbsp;

## What It Does

Safe Web Domains automatically detects fraudulent websites that impersonate legitimate institutions by analyzing six types of typosquatting attacks:

- **Character Substitution**: `paypal.com` → `paypa1.com` (l→1)
- **Character Omission**: `cgd.pt` → `cg.pt` (missing 'd')
- **Character Addition**: `cgd.pt` → `cgdd.pt` (extra 'd')
- **Subdomain Abuse**: `cgd.pt.secure-login.com`
- **TLD Substitution**: `paypal.com` → `paypal.co`
- **Homoglyph Attacks**: `revolut.com` → `revоlut.com` (Cyrillic 'о')

&nbsp;

## How It Works

1. **Content Script** runs on every webpage and extracts the current domain
2. **Detection Engine** compares the domain against the institutions database using:
   - Levenshtein distance algorithm for similarity calculation
   - Pattern matching for six attack types
   - Dynamic thresholds based on domain length
3. **Background Worker** updates the extension icon based on risk level
4. **Popup Interface** displays detailed information when clicked

&nbsp;

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sw-domains.git
   cd sw-domains
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `sw-domains` folder

3. **Test it out**
   - Visit a potential typosquatting attempt → Red icon and popup, _suspicious_ website
   - Visit a legitimate site like `https://revolut.com` → Green badge, _legitimate_ website
   - Visit any unknown site → Blue icon, _unkwown_ website
   - The extension will analyze domains automatically

&nbsp;

## Technical Details

**Detection Algorithm**:
- Implements Levenshtein distance for string similarity
- Uses dynamic thresholds (85% for short domains, 70% for longer ones)
- Pattern detection for six attack types
- Homoglyph mapping for 20+ character pairs

**Supported Institutions**:
- 15+ Portuguese banks (CGD, Millennium BCP, Santander, etc.)
- 10+ payment platforms (PayPal, MB WAY, Stripe, etc.)
- 8+ cryptocurrency exchanges (Coinbase, Binance, Kraken, etc.)
- 5+ fintech services (Revolut, N26, Wise, etc.)

&nbsp;

## Architecture

```
sw-domains/
├── manifest.json              # Extension configuration
├── background.js              # Service worker (icon management)
├── content.js                 # Page analysis orchestrator
├── institutions.js            # Database of 70+ verified institutions
├── typosquatting-detector.js  # Detection algorithms
├── popup.html/js              # User interface
├── styles.css                 # Visual design
├── _locales/pt/               # Portuguese translations
├── icons/                     # Extension icons
└── media/                     # Background images
```

&nbsp;

## Contributing

This is an experimental learning project, but contributions are always welcome! If you'd like to:

- Add more institutions to the database
- Improve detection algorithms
- Fix bugs or improve performance
- Add support for other languages

Please open an issue or submit a pull request.
