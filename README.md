# Noxil Mail - Temporary Email Service

![Noxil Mail](https://img.shields.io/badge/Noxil-Mail-6366f1?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

**Email That Vanishes** - A premium temporary email service built with Next.js

## 🚀 Features

- ✅ **Free & Unlimited** - Generate unlimited temporary emails
- ✅ **No Registration** - Start using immediately
- ✅ **Auto-Refresh** - Real-time email updates
- ✅ **Privacy First** - Your real email stays protected
- ✅ **Multi-Language** - English & Arabic with full RTL support
- ✅ **Premium Design** - Modern, professional UI
- ✅ **SEO Optimized** - Ready to rank on Google
- ✅ **Mobile Ready** - PWA-enabled responsive design

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Internationalization**: next-i18next
- **API Integration**: Axios
- **Icons**: React Icons
- **Notifications**: React Hot Toast

## 📦 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/noxil-mail)

### One-Click Deploy

1. Click the "Deploy" button above
2. Connect your GitHub account
3. Vercel will automatically detect Next.js
4. Click "Deploy"
5. Your site will be live in ~2 minutes!

### Manual Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🌍 Language Support

- **English** - Default
- **Arabic** - Full RTL support

Access languages:
- English: `https://noxilmail.com`
- Arabic: `https://noxilmail.com/ar`

## 📁 Project Structure

```
noxil-mail/
├── pages/
│   ├── index.js           # Landing page
│   ├── app.js             # Main application
│   ├── _app.js            # App wrapper
│   └── api/               # API routes
├── components/
│   └── LanguageButton.js  # Language switcher
├── styles/
│   └── globals.css        # Global styles & RTL support
├── public/
│   ├── locales/           # Translation files
│   ├── robots.txt         # SEO robots file
│   ├── sitemap.xml        # SEO sitemap
│   └── manifest.json      # PWA manifest
├── next.config.js         # Next.js config
├── next-i18next.config.js # i18n config
└── vercel.json            # Vercel config
```

## 🎨 Customization

### Brand Colors

Edit in `tailwind.config.js`:

```js
colors: {
  primary: '#6366f1',    // Indigo
  secondary: '#8b5cf6',  // Purple
  accent: '#3b82f6',     // Blue
}
```

### Translations

Edit translation files:
- English: `public/locales/en/common.json`
- Arabic: `public/locales/ar/common.json`

## 🔧 Configuration

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=your-api-url
NEXT_PUBLIC_SITE_URL=https://noxilmail.com
```

## 📊 SEO

Optimized for search engines:
- Meta tags for all pages
- Open Graph & Twitter Cards
- Structured data (JSON-LD)
- Sitemap & robots.txt
- Hreflang for multi-language

## 🧪 Testing

```bash
# Run tests
npm test

# Coverage report
npm run test:coverage
```

## 📈 Performance

- Lighthouse Score: 95+
- Core Web Vitals: All Green
- Mobile-First Design
- Optimized Bundle Size

## 🔒 Security

- XSS Protection
- Content Security Policy
- HTTPS Only
- Secure Headers

## 📝 License

MIT License - Feel free to use for personal or commercial projects

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

## 📧 Support

For support, email: support@noxilmail.com

## 🌟 Show Your Support

Give a ⭐️ if this project helped you!

---

**Built with ❤️ by Noxil Team**
