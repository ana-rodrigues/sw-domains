# Safe Web Domains

A Chrome extension that protects users from phishing and typosquatting attacks by analysing domains in real-time and providing instant visual feedback. This project was built as a learning experiment using Windsurf AI as a tutor to learn Chrome extension development.

![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome)
![Manifest V3](https://img.shields.io/badge/Manifest-V3-green)

&nbsp;

[![Watch the demo](https://private-user-images.githubusercontent.com/32597845/508566484-c5ec3f4b-87ec-4070-aef9-4ccee0a6de4c.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjIwMTAwMDUsIm5iZiI6MTc2MjAwOTcwNSwicGF0aCI6Ii8zMjU5Nzg0NS81MDg1NjY0ODQtYzVlYzNmNGItODdlYy00MDcwLWFlZjktNGNjZWUwYTZkZTRjLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTExMDElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMTAxVDE1MDgyNVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTYzYjk1OTkxNzRhNGM2ZTE3OTg1ZjRkMDNjNTZiYmQyM2E3MWM1ZDIwMTZmN2UxMTlhNjZiZDZmMjY4MTMyMjkmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.At265BCcHZxQGeyFYV2mbcVdfyQDox2Tig_AoTNCDDc)](https://private-user-images.githubusercontent.com/32597845/508566057-2ba574ee-e243-4ac3-b916-54a00d93da9a.mp4?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NjIwMDk4NzksIm5iZiI6MTc2MjAwOTU3OSwicGF0aCI6Ii8zMjU5Nzg0NS81MDg1NjYwNTctMmJhNTc0ZWUtZTI0My00YWMzLWI5MTYtNTRhMDBkOTNkYTlhLm1wND9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTExMDElMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUxMTAxVDE1MDYxOVomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTI1NDQwNWNjZWIyMmJjZjdjOTgwM2RmNWU0MzBmZWIzZGIxMzVmZTUwNGQxNzMyNWFkNzYwOWUxOTY5MjZkMGUmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.iYa8A8mfTvPesmUVarZ5Le6gbj4XBH87ENQPXXo2jt8)

**Important Disclaimer**: This extension is an experimental project built for learning purposes. While it achieves 94.3% detection accuracy in testing, it should not be considered a complete security solution. Always verify URLs manually when entering sensitive information.

&nbsp;

## What It Does

The extension automatically detects fraudulent websites that impersonate legitimate institutions by analysing six types of typosquatting attacks:

- **Character Substitution**: `paypal.com` → `paypa1.com` (l→1)
- **Character Omission**: `cgd.pt` → `cg.pt` (missing 'd')
- **Character Addition**: `cgd.pt` → `cgdd.pt` (extra 'd')
- **Subdomain Abuse**: `cgd.pt.secure-login.com`
- **TLD Substitution**: `paypal.com` → `paypal.co`
- **Homoglyph Attacks**: `revolut.com` → `revоlut.com` (Cyrillic 'о')

&nbsp;

## How It Works

1. **Content Script** runs on every webpage and extracts the current domain
2. **Detection Engine** compares the domain against a database of Portuguese institutions using:
   - Levenshtein distance algorithm for similarity calculation
   - Pattern matching for six common typosquatting attack types
   - Dynamic thresholds based on domain length for accurate detection
3. **Background Worker** updates the extension icon based on risk level (suspicious, legitimate, or unknown), providing a passive visual cue of the domain's risk level
4. **Popup Interface** automatically triggers to get the user's attention if the domain is suspicious. Otherwise, the popup can be manually opened to view the analysis results without disrupting the user experience

&nbsp;

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ana-rodrigues/sw-domains.git
   cd sw-domains
   ```

2. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `sw-domains` folder

3. **Test it out**
   - Visit a potential typosquatting attempt → Red icon and popup: _suspicious_ website
   - Visit a legitimate site like `https://revolut.com` → Green badge: _legitimate_ website
   - Visit any unknown site → Blue icon: _unknown_ website
   - The extension will analyse domains automatically

&nbsp;

## Technical Details

### Coverage

This is an experimental learning project that uses a limited database of institutional domains (banks, public services) tailored to the Portuguese audience. The database is not exhaustive but serves as a means to illustrate the extension's capabilities.

**Supported Institutions**:
- 15+ Portuguese banks (CGD, Millennium BCP, Santander, etc.)
- 10+ payment platforms (PayPal, MB WAY, Stripe, etc.)
- 8+ cryptocurrency exchanges (Coinbase, Binance, Kraken, etc.)
- 5+ fintech services (Revolut, N26, Wise, etc.)
- And growing...

### Localisation

The extension is currently available in Portuguese. However, it is structured to be easily translated into multiple languages.

### Testing

The project includes an automated test suite that validates the typosquatting detection engine against a comprehensive dataset of legitimate and malicious domains.

**Running the Tests**

1. **Basic test run** (shows summary results):
   ```bash
   npm test
   ```

2. **Verbose test run** (shows detailed output for each test case):
   ```bash
   npm test:verbose
   ```

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

This is an experimental learning project, but contributions are always welcome! If you would like to:

- Add more institutions to the database
- Improve detection algorithms
- Fix bugs or improve performance
- Add support for other languages

Please open an issue or submit a pull request.

&nbsp;

## Licence

This project is licensed under the MIT Licence. See the [LICENSE](LICENSE) file for details.

&nbsp;

## Acknowledgements

Built as a learning project with [Windsurf AI](https://codeium.com/windsurf) as a development tutor.
