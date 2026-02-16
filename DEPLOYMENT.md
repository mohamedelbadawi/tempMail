# 🚀 Deployment Guide - Noxil Mail

## Deploy to Vercel (Recommended)

### Method 1: One-Click Deploy (Easiest)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Noxil Mail"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/noxil-mail.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js ✅
   - Click "Deploy"
   - Done! Your site is live in ~2 minutes

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name? noxil-mail
# - Directory? ./  (root directory)
# - Build command? (leave default)
# - Output directory? (leave default)

# Deploy to production
vercel --prod
```

---

## 📋 Pre-Deployment Checklist

### ✅ Required Files (All Present)
- [x] `package.json` - At root ✅
- [x] `next.config.js` - Next.js config ✅
- [x] `vercel.json` - Vercel config ✅
- [x] `pages/` - Pages directory ✅
- [x] `public/` - Static assets ✅
- [x] `.gitignore` - Git ignore rules ✅

### ✅ Configuration Check
- [x] No client/ subfolder ✅
- [x] All dependencies in package.json ✅
- [x] Next.js 14 configured ✅
- [x] i18n configured ✅
- [x] API routes in pages/api/ ✅

---

## ⚙️ Environment Variables

### On Vercel Dashboard

1. Go to Project Settings → Environment Variables
2. Add these variables:

```env
# Optional - API Configuration
NEXT_PUBLIC_API_URL=https://mail.chatgpt.org.uk

# Optional - Site URL (Vercel auto-provides this)
NEXT_PUBLIC_SITE_URL=https://noxilmail.com

# Optional - Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Note**: Vercel automatically provides:
- `VERCEL_URL` - Your deployment URL
- `VERCEL_ENV` - Environment (production/preview)
- `VERCEL_GIT_COMMIT_SHA` - Git commit hash

---

## 🌐 Custom Domain Setup

### Add Custom Domain

1. **Buy Domain** (e.g., noxilmail.com)
2. **In Vercel Dashboard**:
   - Go to your project
   - Click "Settings" → "Domains"
   - Add domain: `noxilmail.com`
   - Add domain: `www.noxilmail.com`

3. **DNS Configuration**:

   **Option A: Vercel Nameservers (Recommended)**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

   **Option B: Custom DNS (A Records)**
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for DNS propagation** (5-60 minutes)
5. **SSL Certificate** - Auto-provisioned by Vercel ✅

---

## 🔧 Build Configuration

### Automatic (Vercel Auto-Detects)

Vercel automatically uses these settings:

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

### Custom Build (if needed)

Override in `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "installCommand": "npm ci",
  "framework": "nextjs"
}
```

---

## 📊 Performance Optimization

### Vercel Automatic Optimizations

✅ **Edge Network** - Global CDN
✅ **Image Optimization** - Automatic WebP conversion
✅ **Caching** - Smart cache headers
✅ **Compression** - Gzip/Brotli
✅ **SSL/TLS** - Free HTTPS
✅ **HTTP/2** - Enabled by default

### Additional Optimizations

1. **Enable Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Enable Vercel Speed Insights**
   ```bash
   npm install @vercel/speed-insights
   ```

---

## 🌍 Multi-Language Deployment

Your site supports English & Arabic:

### Automatic Routes (Configured ✅)
- `https://noxilmail.com/` → English
- `https://noxilmail.com/ar` → Arabic
- `https://noxilmail.com/app` → Email app

### Hreflang Tags (Already Added ✅)
```html
<link rel="alternate" hreflang="en" href="https://noxilmail.com" />
<link rel="alternate" hreflang="ar" href="https://noxilmail.com/ar" />
```

---

## 🔍 SEO Configuration

### Google Search Console

1. **Verify Ownership**
   - Go to [search.google.com/search-console](https://search.google.com/search-console)
   - Add property: `noxilmail.com`
   - Verify via DNS TXT record (recommended)

2. **Submit Sitemap**
   - URL: `https://noxilmail.com/sitemap.xml`
   - Submit in Search Console

### Bing Webmaster Tools

1. **Verify Site**
   - Go to [bing.com/webmasters](https://www.bing.com/webmasters)
   - Add site
   - Verify via DNS

2. **Submit Sitemap**
   - URL: `https://noxilmail.com/sitemap.xml`

---

## 📈 Monitoring

### Vercel Dashboard

Monitor in real-time:
- **Deployments** - Build status
- **Analytics** - Page views, visitors
- **Speed Insights** - Core Web Vitals
- **Logs** - Runtime logs
- **Bandwidth** - Usage stats

### Google Analytics (Optional)

Add to `pages/_app.js`:

```js
import Script from 'next/script'

// Add in MyApp component
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
```

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Module not found`
```bash
# Solution: Install dependencies
npm install
# Commit package-lock.json
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

**Error**: `next/dynamic error`
```bash
# Solution: Clear cache and rebuild
rm -rf .next
npm run build
```

### Deployment Success but Site Not Working

1. **Check Build Logs** in Vercel dashboard
2. **Check Function Logs** for API errors
3. **Verify Environment Variables** are set
4. **Check DNS Configuration** if using custom domain

### i18n Not Working

1. **Verify** `next-i18next.config.js` is at root
2. **Check** locale files in `public/locales/`
3. **Ensure** `getServerSideProps` exports translation props

---

## 🔄 Continuous Deployment

### Automatic Deployments

✅ **Production** - `main` branch → noxilmail.com
✅ **Preview** - Pull requests → preview-xyz.vercel.app
✅ **Development** - Other branches → dev-xyz.vercel.app

### Branch Configuration

```bash
# Production deployment
git push origin main

# Preview deployment
git checkout -b feature/new-feature
git push origin feature/new-feature
# Creates preview URL automatically
```

---

## 💾 Backup & Rollback

### Instant Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Site rolls back instantly ✅

### GitHub Backup

All code is backed up on GitHub:
```bash
# Clone from backup
git clone https://github.com/YOUR_USERNAME/noxil-mail.git
```

---

## 📝 Deployment Checklist

### Before First Deploy
- [ ] All code committed to Git
- [ ] `package.json` at root ✅
- [ ] No `client/` folder ✅
- [ ] Environment variables documented
- [ ] README.md updated
- [ ] .gitignore configured ✅
- [ ] vercel.json created ✅

### After Deploy
- [ ] Site loads correctly
- [ ] Both languages work (EN/AR)
- [ ] API routes respond
- [ ] Email generation works
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain connected
- [ ] Sitemap submitted to Google
- [ ] Analytics tracking

---

## 🎉 Post-Deployment

### Share Your Site

```
🎉 Noxil Mail is Live!
✅ English: https://noxilmail.com
✅ Arabic: https://noxilmail.com/ar
✅ Features: Free temporary email, auto-refresh, multi-language
✅ Performance: 95+ Lighthouse score
```

### Next Steps

1. **Monitor**: Check Vercel analytics daily
2. **SEO**: Submit sitemap to search engines
3. **Marketing**: Share on social media
4. **Improve**: Gather user feedback
5. **Scale**: Add features based on usage

---

## 🆘 Support

### Vercel Support
- Docs: [vercel.com/docs](https://vercel.com/docs)
- Discord: [vercel.com/discord](https://vercel.com/discord)

### Next.js Support
- Docs: [nextjs.org/docs](https://nextjs.org/docs)
- GitHub: [github.com/vercel/next.js](https://github.com/vercel/next.js)

---

**Your Noxil Mail is now ready for deployment!** 🚀

Deploy with confidence - everything is configured correctly! ✅
