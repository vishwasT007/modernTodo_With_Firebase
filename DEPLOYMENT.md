# 🚀 Deployment Guide

Complete guide for deploying your React Todo App to various platforms with CI/CD automation.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Platform-Specific Guides](#platform-specific-guides)
  - [Firebase Hosting](#firebase-hosting)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [GitHub Pages](#github-pages)
- [CI/CD Setup](#cicd-setup)
- [Environment Variables](#environment-variables)
- [Post-Deployment](#post-deployment)
- [Troubleshooting](#troubleshooting)

---

## ✅ Prerequisites

Before deploying, ensure you have:

- ✅ Node.js 16+ installed
- ✅ Git repository set up
- ✅ `.env` file configured with Firebase credentials
- ✅ All tests passing (`npm test`)
- ✅ Application building successfully (`npm run build`)
- ✅ GitHub account (for CI/CD)

---

## 🚀 Quick Start

### **Option 1: Using Deployment Script (Recommended)**

```bash
# Make the script executable (first time only)
chmod +x deploy.sh

# Run the interactive deployment script
./deploy.sh

# Or deploy to specific platform
./deploy.sh firebase
./deploy.sh vercel
./deploy.sh netlify
./deploy.sh github-pages
```

### **Option 2: Manual Deployment**

Choose your platform from the guides below.

---

## 🌐 Platform-Specific Guides

### 🔥 **Firebase Hosting**

Firebase Hosting is ideal for this project since you're already using Firebase.

#### **1. Setup Firebase CLI**

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting (if not already done)
firebase init hosting
```

#### **2. Configure `firebase.json`**

The project already includes `firebase.json`. Verify it:

```json
{
  "hosting": {
    "public": "build",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

#### **3. Build and Deploy**

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Or use the deployment script
./deploy.sh firebase
```

#### **4. View Your App**

```
🌐 https://YOUR_PROJECT_ID.web.app
🌐 https://YOUR_PROJECT_ID.firebaseapp.com
```

#### **5. Custom Domain (Optional)**

1. Go to Firebase Console → Hosting
2. Click "Add custom domain"
3. Follow the DNS configuration steps

---

### ▲ **Vercel**

Vercel offers excellent performance and DX for React apps.

#### **1. Setup Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login
```

#### **2. First-Time Setup**

```bash
# Deploy and configure
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up project settings
```

#### **3. Add Environment Variables**

```bash
# Add environment variables (one at a time)
vercel env add REACT_APP_FIREBASE_API_KEY production
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN production
vercel env add REACT_APP_FIREBASE_PROJECT_ID production
vercel env add REACT_APP_FIREBASE_STORAGE_BUCKET production
vercel env add REACT_APP_FIREBASE_MESSAGING_SENDER_ID production
vercel env add REACT_APP_FIREBASE_APP_ID production
```

Or add them via Vercel Dashboard:
1. Project Settings → Environment Variables
2. Add each `REACT_APP_*` variable
3. Select "Production", "Preview", and "Development"

#### **4. Deploy**

```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Or use the deployment script
./deploy.sh vercel
```

#### **5. Custom Domain**

1. Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Configure DNS (Vercel provides instructions)

---

### 🌐 **Netlify**

Netlify is great for static sites with serverless functions.

#### **1. Setup Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login
```

#### **2. Initialize Netlify**

```bash
# Link to existing site or create new
netlify init

# Follow the prompts:
# - Create & configure a new site
# - Build command: npm run build
# - Publish directory: build
```

#### **3. Add Environment Variables**

Via CLI:
```bash
netlify env:set REACT_APP_FIREBASE_API_KEY "your_value"
netlify env:set REACT_APP_FIREBASE_AUTH_DOMAIN "your_value"
# ... add all variables
```

Or via Dashboard:
1. Site Settings → Build & deploy → Environment
2. Click "Edit variables"
3. Add each `REACT_APP_*` variable

#### **4. Deploy**

```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod

# Or use the deployment script
./deploy.sh netlify
```

#### **5. Custom Domain**

1. Netlify Dashboard → Domain settings
2. Add custom domain
3. Configure DNS

---

### 📄 **GitHub Pages**

Free hosting for public repositories.

#### **1. Install gh-pages**

```bash
npm install --save-dev gh-pages
```

#### **2. Update `package.json`**

Add these scripts and homepage field:

```json
{
  "homepage": "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

#### **3. Deploy**

```bash
# Build and deploy
npm run deploy

# Or use the deployment script
./deploy.sh github-pages
```

#### **4. Enable GitHub Pages**

1. Repository → Settings → Pages
2. Source: `gh-pages` branch
3. Save

#### **5. View Your App**

```
🌐 https://YOUR_USERNAME.github.io/YOUR_REPO_NAME
```

---

## 🤖 CI/CD Setup

Automate deployments with GitHub Actions.

### **1. Setup GitHub Repository**

```bash
# Initialize git (if not already done)
git init

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push code
git add .
git commit -m "Initial commit"
git push -u origin main
```

### **2. Add GitHub Secrets**

Go to: Repository → Settings → Secrets and variables → Actions

Add these secrets:

#### **For All Platforms:**
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
REACT_APP_API_BASE_URL
```

#### **For Firebase Deployment:**
```
FIREBASE_SERVICE_ACCOUNT
FIREBASE_TOKEN
```

Get Firebase token:
```bash
firebase login:ci
```

#### **For Vercel Deployment:**
```
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

Get Vercel token:
1. Vercel Dashboard → Settings → Tokens
2. Create new token
3. Get org/project IDs from `.vercel/project.json` after first `vercel` command

#### **For Netlify Deployment:**
```
NETLIFY_AUTH_TOKEN
NETLIFY_SITE_ID
```

Get Netlify token:
1. Netlify Dashboard → User settings → Applications
2. Create new access token
3. Site ID from: Site settings → General → API ID

### **3. GitHub Actions Workflows**

The project includes these workflows:

#### **`ci.yml` - Continuous Integration**
- Runs on push/PR to main/develop
- Linting, type-checking, testing
- Build verification
- Security audit

#### **`deploy-firebase.yml` - Firebase Deployment**
- Deploys to Firebase Hosting on push to main
- Runs tests before deployment
- Deploys Firestore rules

#### **`deploy-vercel.yml` - Vercel Deployment**
- Deploys preview on PR
- Deploys production on push to main
- Comments PR with preview URL

#### **`deploy-netlify.yml` - Netlify Deployment**
- Deploys on push to main
- Runs tests before deployment

### **4. Trigger Deployment**

```bash
# Commit and push to trigger CI/CD
git add .
git commit -m "feat: add new feature"
git push origin main

# Check Actions tab in GitHub to see progress
```

---

## 🔐 Environment Variables

### **Required Variables**

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_FIREBASE_API_KEY` | Firebase API key | `AIzaSyD...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `myapp.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | Firebase project ID | `myapp-12345` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | `myapp.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | FCM sender ID | `123456789` |
| `REACT_APP_FIREBASE_APP_ID` | Firebase app ID | `1:123:web:abc` |

### **Optional Variables**

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_FIREBASE_MEASUREMENT_ID` | Google Analytics | - |
| `REACT_APP_API_BASE_URL` | API base URL | - |
| `REACT_APP_ENVIRONMENT` | Environment name | `production` |
| `GENERATE_SOURCEMAP` | Generate source maps | `false` |

### **Platform-Specific Setup**

#### **Firebase:**
Set via Firebase CLI:
```bash
firebase functions:config:set \
  firebase.api_key="YOUR_KEY" \
  firebase.auth_domain="YOUR_DOMAIN"
```

#### **Vercel:**
```bash
vercel env add VARIABLE_NAME production
```

#### **Netlify:**
```bash
netlify env:set VARIABLE_NAME "value"
```

---

## ✅ Post-Deployment

### **1. Verify Deployment**

- ✅ App loads without errors
- ✅ Authentication works (sign up/login)
- ✅ Todos CRUD operations work
- ✅ Real-time sync working
- ✅ PWA features working (offline, install)
- ✅ Service worker registered
- ✅ No console errors

### **2. Test on Multiple Devices**

- 📱 Mobile (iOS & Android)
- 💻 Desktop (Chrome, Firefox, Safari, Edge)
- 📱 Tablet

### **3. Performance Check**

Run Lighthouse audit:
```bash
# Install Lighthouse CLI
npm install -g lighthouse

# Run audit
lighthouse https://your-app-url.com --view
```

Target scores:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+
- PWA: 80+

### **4. Set Up Monitoring**

#### **Firebase Performance Monitoring:**
```bash
# Enable in Firebase Console
# Performance → Get Started
```

#### **Google Analytics:**
```javascript
// Add to src/utils/analytics.js
import { getAnalytics } from 'firebase/analytics';
const analytics = getAnalytics(app);
```

#### **Error Tracking:**
Consider adding:
- Sentry
- LogRocket
- Bugsnag

### **5. SEO Optimization**

- ✅ Add sitemap.xml
- ✅ Add robots.txt
- ✅ Configure meta tags
- ✅ Add Open Graph tags
- ✅ Add structured data

### **6. Custom Domain (Optional)**

#### **Firebase:**
```bash
firebase hosting:channel:deploy live --expires 30d
```

#### **Vercel/Netlify:**
Configure in dashboard (see platform-specific guides above)

---

## 🐛 Troubleshooting

### **Issue: Build Fails**

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear build cache
rm -rf build node_modules/.cache

# Try building again
npm run build
```

---

### **Issue: Environment Variables Not Loading**

**Checklist:**
- ✅ Variables start with `REACT_APP_`
- ✅ `.env` file exists in root
- ✅ Variables set in hosting platform
- ✅ Server restarted after adding variables
- ✅ No quotes around values in `.env`

**Solution:**
```bash
# Check if variables are loaded
npm run build
grep -r "REACT_APP_FIREBASE_API_KEY" build/

# Should find references to your actual API key
```

---

### **Issue: Firebase Authentication Not Working**

**Checklist:**
- ✅ Firebase Auth enabled in console
- ✅ Email/Password provider enabled
- ✅ Authorized domains added (for production)

**Solution:**
1. Firebase Console → Authentication → Settings → Authorized domains
2. Add your deployment domain
3. Save and try again

---

### **Issue: 404 on Refresh**

**Cause:** SPA routing not configured

**Firebase Solution:**
Ensure `firebase.json` has rewrites:
```json
{
  "hosting": {
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

**Vercel Solution:**
Ensure `vercel.json` has routes configuration (already included)

**Netlify Solution:**
Ensure `netlify.toml` has redirects (already included)

---

### **Issue: CI/CD Pipeline Fails**

**Common causes:**
1. Missing GitHub secrets
2. Test failures
3. Linting errors
4. Type errors

**Solution:**
```bash
# Run checks locally first
npm run lint
npm run type-check
npm run test:ci
npm run build

# Fix any errors before pushing
```

---

### **Issue: Slow Build Times**

**Solution:**
```bash
# Use build cache
# Vercel/Netlify automatically cache node_modules

# For GitHub Actions, add caching:
# (already included in workflows)
```

---

### **Issue: Large Bundle Size**

**Check bundle size:**
```bash
npm run analyze
```

**Optimization tips:**
1. Enable code splitting
2. Lazy load routes
3. Optimize images
4. Remove unused dependencies
5. Use production build

---

## 📊 Deployment Comparison

| Feature | Firebase | Vercel | Netlify | GitHub Pages |
|---------|----------|--------|---------|--------------|
| **Free Tier** | ✅ 10GB/month | ✅ 100GB/month | ✅ 100GB/month | ✅ 1GB/month |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| **SSL** | ✅ Auto | ✅ Auto | ✅ Auto | ✅ Auto |
| **CDN** | ✅ Global | ✅ Edge | ✅ Global | ✅ Limited |
| **Build Minutes** | - | ✅ 6000/month | ✅ 300/month | ✅ 2000/month |
| **Preview Deploys** | ✅ Channels | ✅ Automatic | ✅ Automatic | ❌ |
| **Serverless Functions** | ✅ Firebase | ✅ Vercel | ✅ Netlify | ❌ |
| **Analytics** | ✅ Built-in | ✅ Analytics | ✅ Analytics | ❌ |
| **Forms** | ❌ | ❌ | ✅ Built-in | ❌ |
| **Best For** | Firebase apps | React/Next.js | Static + Forms | Open source |

---

## 🎯 Recommended Setup

For this project, I recommend:

### **Option 1: Firebase Hosting (Best Match)**
- ✅ Already using Firebase
- ✅ Integrated authentication
- ✅ Easy Firestore integration
- ✅ Good free tier
- ✅ Simple deployment

### **Option 2: Vercel (Best Performance)**
- ✅ Excellent DX
- ✅ Fast edge network
- ✅ Automatic previews
- ✅ Great for React apps
- ✅ Easy custom domains

### **Option 3: Netlify (Most Features)**
- ✅ Great free tier
- ✅ Built-in forms
- ✅ Serverless functions
- ✅ Good performance
- ✅ Easy rollbacks

---

## 📚 Additional Resources

- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Create React App Deployment](https://create-react-app.dev/docs/deployment)

---

## 🆘 Need Help?

1. Check [Troubleshooting](#troubleshooting) section
2. Review platform documentation
3. Check GitHub Actions logs
4. Review Firebase Console logs
5. Open an issue on GitHub

---

**Last Updated:** October 2025  
**Version:** 1.0.0

---

✨ **Your app is now ready for production deployment!** 🚀

