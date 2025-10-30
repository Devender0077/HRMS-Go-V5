# CDN Setup Guide for HRMS
## How to Create Your Own CDN for Fast Performance & Security

This guide explains how to set up your own Content Delivery Network (CDN) for serving static assets like PDF workers, images, fonts, and other files with maximum performance and security.

---

## 📊 Why Create Your Own CDN?

### **Current Setup (Local Files):**
- ✅ Works offline
- ✅ No external dependencies
- ✅ Version control
- ❌ Slower for distributed teams
- ❌ No edge caching
- ❌ Higher server load

### **With CDN:**
- ✅ Lightning fast (edge caching)
- ✅ Global distribution
- ✅ Reduced server load
- ✅ Better security (DDoS protection)
- ✅ Auto-scaling
- ✅ Analytics

---

## 🚀 CDN Options (Free & Paid)

### **Option 1: Cloudflare (Recommended - FREE)**

**Why Cloudflare:**
- ✅ Free tier (unlimited bandwidth)
- ✅ 300+ edge locations worldwide
- ✅ Built-in DDoS protection
- ✅ Auto SSL/TLS
- ✅ Analytics dashboard
- ✅ Cache purging
- ✅ 5-second setup

**Setup Steps:**
1. Sign up: https://cloudflare.com
2. Add your domain
3. Update nameservers at your registrar
4. Enable "Always Use HTTPS"
5. Set cache rules for static assets
6. Done!

**HRMS Configuration:**
```javascript
// In .env
REACT_APP_CDN_URL=https://cdn.yourdomain.com

// In code
const workerUrl = `${process.env.REACT_APP_CDN_URL}/pdf.worker.min.mjs`;
```

**Upload Assets:**
```bash
# Upload to Cloudflare R2 (S3-compatible)
aws s3 cp public/pdf.worker.min.mjs s3://your-bucket/assets/
```

**Cost:** FREE for most use cases (up to 10M requests/month)

---

### **Option 2: AWS CloudFront (Enterprise)**

**Why AWS CloudFront:**
- ✅ 400+ edge locations
- ✅ Integration with S3
- ✅ Advanced caching rules
- ✅ Real-time logs
- ✅ Lambda@Edge
- ✅ Enterprise SLA

**Setup Steps:**
1. Create S3 bucket
2. Upload assets to S3
3. Create CloudFront distribution
4. Point to S3 bucket
5. Configure cache behaviors
6. Add custom domain (optional)

**HRMS Configuration:**
```javascript
// .env
REACT_APP_CDN_URL=https://d123xyz.cloudfront.net

// Upload script
aws s3 sync public/ s3://hrms-assets/
aws cloudfront create-invalidation --distribution-id E123 --paths "/*"
```

**Cost:** ~$5-20/month (pay-as-you-go, 1TB free first year)

---

### **Option 3: Vercel/Netlify (Easiest)**

**Why Vercel/Netlify:**
- ✅ Automatic CDN
- ✅ Deploy from GitHub
- ✅ Zero configuration
- ✅ HTTPS auto
- ✅ Preview deployments
- ✅ Edge functions

**Setup Steps:**
1. Connect GitHub repo
2. Deploy frontend
3. Assets automatically served via CDN
4. Done!

**Cost:** FREE for hobby projects (100GB bandwidth/month)

---

### **Option 4: BunnyCDN (Cheapest - Pay-as-you-go)**

**Why BunnyCDN:**
- ✅ $1/TB bandwidth (cheapest)
- ✅ 114 edge locations
- ✅ No hidden fees
- ✅ Real-time purging
- ✅ Stream optimization
- ✅ 14-day trial

**Setup:**
```bash
# Upload via FTP or API
curl -X PUT https://storage.bunnycdn.com/your-zone/pdf.worker.min.mjs \
  -H "AccessKey: your-api-key" \
  --data-binary @public/pdf.worker.min.mjs
```

**Cost:** ~$1-5/month for HRMS usage

---

## 🏗️ Recommended CDN Setup for HRMS

### **Architecture:**

```
┌─────────────────────────────────────────────────────────────┐
│ USER BROWSER                                                │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ React App (localhost:3000 or yourdomain.com)         │   │
│ └───────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │ Loads assets from:                               │
│           ▼                                                  │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ CDN Edge Server (Nearest location)                    │   │
│ │ - pdf.worker.min.mjs                                  │   │
│ │ - fonts/                                              │   │
│ │ - icons/                                              │   │
│ │ - images/                                             │   │
│ └───────────────────────────────────────────────────────┘   │
│           │                                                  │
│           │ If not cached, fetches from:                     │
│           ▼                                                  │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Origin Server (Your S3/R2/Storage)                    │   │
│ │ - All static assets                                   │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### **Best Practice Setup:**

**1. Static Assets (CDN):**
```
https://cdn.yourdomain.com/
├── workers/
│   └── pdf.worker.min.mjs
├── fonts/
│   ├── CircularStd-Bold.otf
│   └── Roboto-Regular.ttf
├── icons/
│   └── *.svg
└── images/
    └── *.webp
```

**2. Dynamic API (No CDN):**
```
https://api.yourdomain.com/
└── /api/*  (Direct to backend, no caching)
```

**3. Frontend App (CDN):**
```
https://app.yourdomain.com/ or https://yourdomain.com/
└── React build files (HTML, JS, CSS)
```

---

## 🔒 Security Best Practices

### **1. CORS Configuration:**
```javascript
// backend/server.js
const cors = require('cors');

app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://app.yourdomain.com',
    'https://cdn.yourdomain.com',
  ],
  credentials: true,
}));
```

### **2. Content Security Policy (CSP):**
```html
<!-- public/index.html -->
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    font-src 'self' https://cdn.yourdomain.com;
    connect-src 'self' https://api.yourdomain.com;
    worker-src 'self' blob:;
  ">
```

### **3. Cloudflare Page Rules:**
```
Cache Level: Cache Everything
Browser Cache TTL: 1 month
Edge Cache TTL: 1 month

For:
  *.js (JavaScript files)
  *.css (Stylesheets)
  *.woff2 (Fonts)
  *.svg (Icons)
  *.webp (Images)
  pdf.worker.min.mjs (PDF worker)

For API:
  Bypass Cache for /api/*
```

### **4. Asset Versioning:**
```javascript
// Use hash-based filenames (React does this automatically)
main.a1b2c3d4.js
pdf.worker.min.mjs?v=5.4.296

// In production build:
npm run build  // Creates hashed filenames automatically
```

---

## ⚡ Performance Optimization

### **1. Enable Brotli/Gzip Compression:**
```nginx
# Cloudflare does this automatically
# Or in nginx:
gzip on;
gzip_types application/javascript text/css application/json;
brotli on;
brotli_types application/javascript text/css application/json;
```

### **2. Set Cache Headers:**
```javascript
// backend/server.js
app.use('/uploads', express.static('uploads', {
  maxAge: '1y',  // Cache for 1 year
  immutable: true,
}));
```

### **3. Use WebP for Images:**
```bash
# Already using .webp in public/assets/images/ ✅
```

### **4. Lazy Load Assets:**
```javascript
// Already using React.lazy() for routes ✅
export const TemplateFieldEditorPage = Loadable(
  lazy(() => import('../pages/contracts/TemplateFieldEditorPage'))
);
```

---

## 🌐 DIY CDN with Nginx (Self-Hosted)

If you want full control without third-party CDN:

### **Setup:**

```nginx
# /etc/nginx/sites-available/cdn.yourdomain.com

server {
    listen 80;
    server_name cdn.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name cdn.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/cdn.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/cdn.yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Access-Control-Allow-Origin "https://yourdomain.com" always;

    # Enable caching
    location ~* \.(js|css|mjs|woff2|svg|webp|jpg|png)$ {
        root /var/www/cdn;
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip compression
    gzip on;
    gzip_types application/javascript text/css application/json;
    gzip_min_length 1000;

    # Brotli compression
    brotli on;
    brotli_types application/javascript text/css application/json;
}
```

**Deploy Assets:**
```bash
# Copy files to CDN server
rsync -avz public/ user@cdn-server:/var/www/cdn/
```

**Cost:** ~$5-10/month (VPS) + domain

---

## 📊 Performance Comparison

| Solution | Setup Time | Cost/Month | Performance | Security | Recommended For |
|----------|------------|------------|-------------|----------|-----------------|
| **Local Files** | 0 min | $0 | ⭐⭐⭐ | ⭐⭐⭐⭐ | Development |
| **Cloudflare** | 5 min | $0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | **Production (Best!)** |
| **AWS CloudFront** | 30 min | $5-20 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Enterprise |
| **Vercel/Netlify** | 2 min | $0 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Startups |
| **BunnyCDN** | 10 min | $1-5 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Budget-conscious |
| **Self-hosted Nginx** | 2 hours | $5-10 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Full control |

---

## 🎯 Recommended for HRMS: Cloudflare (FREE)

### **5-Minute Setup:**

```bash
# 1. Build production assets
npm run build

# 2. Sign up for Cloudflare (free)
# Visit: https://cloudflare.com/sign-up

# 3. Add your domain
# Follow wizard to add yourdomain.com

# 4. Update nameservers
# At your domain registrar (GoDaddy, Namecheap, etc.)
# Change nameservers to Cloudflare's

# 5. Configure page rules
# Cloudflare Dashboard → Rules → Page Rules
# Add rule: *.js, *.css, *.mjs → Cache Everything

# 6. Deploy
# Upload build/ folder to your server
# Cloudflare automatically caches it!
```

### **HRMS-Specific Configuration:**

```javascript
// .env.production
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_CDN_URL=https://cdn.yourdomain.com
REACT_APP_APP_URL=https://app.yourdomain.com
```

**Cloudflare Workers (Advanced):**
```javascript
// worker.js - Run code at the edge
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // Cache PDF worker for 1 year
  if (request.url.endsWith('pdf.worker.min.mjs')) {
    const response = await fetch(request)
    const headers = new Headers(response.headers)
    headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    return new Response(response.body, {
      status: response.status,
      headers
    })
  }
  return fetch(request)
}
```

---

## 🔧 Implementation for HRMS

### **Step 1: Prepare Assets**

```bash
# Run setup script to copy correct worker
./setup-pdf-worker.sh

# Verify assets
ls -lh public/pdf.worker.min.mjs
# Should show: 1.0M (version 5.4.296)
```

### **Step 2: Deploy to CDN**

**Option A: Cloudflare R2 (S3-compatible):**
```bash
# Install wrangler CLI
npm install -g wrangler

# Login
wrangler login

# Create bucket
wrangler r2 bucket create hrms-assets

# Upload assets
wrangler r2 object put hrms-assets/pdf.worker.min.mjs --file public/pdf.worker.min.mjs
wrangler r2 object put hrms-assets/fonts/CircularStd-Bold.otf --file public/fonts/CircularStd-Bold.otf

# Get public URL
# R2 bucket → Settings → Public Access → Enable
```

**Option B: AWS S3 + CloudFront:**
```bash
# Upload to S3
aws s3 cp public/pdf.worker.min.mjs s3://hrms-cdn/workers/ --acl public-read

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id E123XYZ \
  --paths "/workers/*"
```

### **Step 3: Update Code**

```javascript
// src/sections/@dashboard/contract/PDFFieldEditor.js
<Document
  file={pdfUrl}
  options={{
    workerSrc: `${process.env.REACT_APP_CDN_URL || ''}/pdf.worker.min.mjs`,
  }}
>
```

### **Step 4: Test**

```bash
# Check worker loads from CDN
curl -I https://cdn.yourdomain.com/pdf.worker.min.mjs

# Should return:
# HTTP/2 200
# content-type: application/javascript
# cache-control: public, max-age=31536000
# cf-cache-status: HIT  ← Served from Cloudflare edge!
```

---

## 📈 Monitoring & Analytics

### **Cloudflare Analytics (Free):**
- Bandwidth usage
- Requests per second
- Cache hit ratio
- Edge response time
- Threats blocked

### **Setup Alerts:**
```
Cloudflare → Notifications → Add Notification
- Type: Usage Alert
- Trigger: Bandwidth > 80% of limit
- Email: your@email.com
```

---

## 🔐 Security Hardening

### **1. Access Control:**
```javascript
// Cloudflare Workers - Token-based access
if (!request.headers.get('X-CDN-Token') === process.env.CDN_TOKEN) {
  return new Response('Forbidden', { status: 403 })
}
```

### **2. Rate Limiting:**
```
Cloudflare → Security → Rate Limiting
- Rule: 100 requests per minute per IP
- Action: Block for 1 hour
```

### **3. Bot Protection:**
```
Cloudflare → Security → Bot Fight Mode
- Enable for all static assets
- Blocks malicious bots
```

### **4. DDoS Protection:**
```
Cloudflare → Security → DDoS
- Automatic (included in free plan)
- Blocks layer 3/4/7 attacks
```

---

## 🎯 Quick Start (Recommended for You)

### **For Development (Now):**
```bash
# Use local files (current setup)
./setup-pdf-worker.sh
npm start

# Worker loads from: http://localhost:3000/pdf.worker.min.mjs
# Fast, secure, no external dependencies ✅
```

### **For Production (Later):**
```bash
# 1. Sign up for Cloudflare (free)
# 2. Add your domain
# 3. Build production
npm run build

# 4. Deploy (choose one):

# Option A: Vercel (Easiest)
npm install -g vercel
vercel

# Option B: Netlify
npm install -g netlify-cli
netlify deploy --prod

# Option C: Own server + Cloudflare
rsync -avz build/ user@server:/var/www/hrms/
# Cloudflare automatically caches everything!
```

---

## 📋 Checklist

- [x] PDF worker setup script created
- [x] Correct worker version (5.4.296) copied
- [x] Local serving configured
- [ ] Cloudflare account (when ready for production)
- [ ] Custom domain (when ready for production)
- [ ] CDN deployment script (when ready for production)

---

## 💡 Current Setup (Development)

**Status:** ✅ Ready for local development

```
PDF Worker: public/pdf.worker.min.mjs (1.0 MB)
Version: 5.4.296 (matches react-pdf)
URL: /pdf.worker.min.mjs
Served by: React dev server (localhost:3000)

Performance: Fast (local)
Security: Excellent (no external dependencies)
Offline: Yes
Cost: $0
```

**To use:** Just restart frontend and hard refresh browser!

---

## 🚀 Next Steps

1. **Now (Development):**
   - Use local worker (already set up)
   - Fast and secure ✅

2. **Later (Production):**
   - Sign up for Cloudflare (5 minutes)
   - Deploy to Vercel/Netlify (2 minutes)
   - Or use AWS CloudFront (30 minutes)

3. **Future (Scale):**
   - Add CDN for all static assets
   - Enable edge caching
   - Monitor with analytics
   - Auto-scaling

---

**For now, your local setup is PERFECT for development! No CDN needed yet.** ✅

