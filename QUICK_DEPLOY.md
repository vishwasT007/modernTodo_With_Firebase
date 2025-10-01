# ⚡ Quick Deployment Reference

Fast reference guide for deploying your React Todo App.

## 🚀 One-Command Deployments

### **Interactive Script (Recommended)**
```bash
./deploy.sh
```

### **Platform-Specific**

```bash
# Firebase Hosting
./deploy.sh firebase
# OR
npm run deploy:firebase

# Vercel
./deploy.sh vercel
# OR
npm run deploy:vercel

# Netlify
./deploy.sh netlify
# OR
npm run deploy:netlify

# GitHub Pages
./deploy.sh github-pages
# OR
npm run deploy
```

---

## 🔐 Required Setup (One-Time)

### **All Platforms**
```bash
# 1. Create .env file
cp env.example .env
# Edit .env with your Firebase credentials

# 2. Install dependencies
npm install

# 3. Test build
npm run build
```

### **Firebase**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### **Vercel**
```bash
npm install -g vercel
vercel login
vercel link
```

### **Netlify**
```bash
npm install -g netlify-cli
netlify login
netlify init
```

### **GitHub Pages**
```bash
npm install --save-dev gh-pages
# Add "homepage" to package.json
```

---

## 🤖 CI/CD Quick Setup

### **1. GitHub Secrets**

Add in: `Settings → Secrets and variables → Actions`

**Required for all:**
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
```

**Firebase deployment:**
```
FIREBASE_TOKEN          # Get: firebase login:ci
FIREBASE_SERVICE_ACCOUNT # Get: Firebase Console → Service Accounts
```

**Vercel deployment:**
```
VERCEL_TOKEN           # Get: Vercel Dashboard → Settings → Tokens
VERCEL_ORG_ID         # Get: .vercel/project.json
VERCEL_PROJECT_ID     # Get: .vercel/project.json
```

**Netlify deployment:**
```
NETLIFY_AUTH_TOKEN    # Get: Netlify → User Settings → Applications
NETLIFY_SITE_ID       # Get: Site Settings → API ID
```

### **2. Push to GitHub**
```bash
git add .
git commit -m "feat: add CI/CD"
git push origin main
```

---

## ✅ Pre-Deployment Checklist

```bash
# Run all checks
npm run lint          # Lint code
npm run type-check    # TypeScript check
npm test              # Run tests
npm run build         # Test build
```

Fix any errors before deploying!

---

## 🐛 Quick Troubleshooting

### **Build Fails**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Environment Variables Not Working**
```bash
# Check .env file exists
ls -la | grep .env

# Verify variables loaded
npm run build
grep -r "REACT_APP_FIREBASE_API_KEY" build/
```

### **Firebase Auth Issues**
1. Firebase Console → Authentication
2. Enable Email/Password
3. Add authorized domains

### **CI/CD Fails**
1. Check GitHub Secrets are set
2. Verify secret names match exactly
3. Check Actions logs for errors

---

## 📊 Platform Comparison

| Feature | Firebase | Vercel | Netlify | GitHub Pages |
|---------|----------|--------|---------|--------------|
| Setup Time | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Free Tier | 10GB/mo | 100GB/mo | 100GB/mo | 1GB/mo |
| Custom Domain | ✅ Free | ✅ Free | ✅ Free | ✅ Free |
| Auto SSL | ✅ | ✅ | ✅ | ✅ |
| Preview Deploys | ✅ | ✅ | ✅ | ❌ |
| **Best For** | **Firebase apps** | **Performance** | **Features** | **Simple** |

---

## 🎯 Recommended Choice

**For this project:** Firebase Hosting (you're already using Firebase!)

```bash
# Quick deploy
./deploy.sh firebase
```

---

## 📞 Need Help?

1. Check full guides:
   - `DEPLOYMENT.md` - Complete deployment guide
   - `CICD_SETUP.md` - CI/CD setup guide
   - `ENVIRONMENT_SETUP.md` - Environment variables guide

2. Common issues:
   - Missing .env file → Run `./setup-env.sh`
   - Build errors → Run `npm run lint` and fix issues
   - Auth errors → Check Firebase Console

3. Platform docs:
   - [Firebase](https://firebase.google.com/docs/hosting)
   - [Vercel](https://vercel.com/docs)
   - [Netlify](https://docs.netlify.com)

---

**Ready to deploy?** Run `./deploy.sh` 🚀

