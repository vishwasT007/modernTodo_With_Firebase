# 🔥 Firebase Environment Configuration Guide

This guide will help you set up environment variables for Firebase integration in your React Todo App.

## 📋 Table of Contents

- [Why Environment Variables?](#why-environment-variables)
- [Quick Setup](#quick-setup)
- [Manual Setup](#manual-setup)
- [Getting Firebase Credentials](#getting-firebase-credentials)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## 🤔 Why Environment Variables?

### ✅ **Benefits:**

1. **Security** - Keep API keys out of source code
2. **Flexibility** - Easy to switch between dev/staging/production
3. **Git Safety** - Never accidentally commit credentials
4. **Team Collaboration** - Each developer uses their own credentials
5. **Best Practice** - Industry-standard approach

### ❌ **Without Environment Variables:**

```javascript
// ❌ BAD - Hardcoded credentials (current approach)
const firebaseConfig = {
  apiKey: "AIzaSyDMJDqiGrIrdAFtU9jsaCOSg7Wj5PTUL6M", // Exposed!
  authDomain: "mytodoapp2025.firebaseapp.com",
  // ...
};
```

### ✅ **With Environment Variables:**

```javascript
// ✅ GOOD - Credentials from .env file
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Secure!
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

---

## 🚀 Quick Setup

### **Option 1: Using Setup Script (Recommended)**

```bash
# Make the script executable
chmod +x setup-env.sh

# Run the setup script
./setup-env.sh

# Follow the prompts to edit .env file
```

### **Option 2: Manual Copy**

```bash
# Copy the example file
cp env.example .env

# Edit with your credentials
nano .env  # or vim, code, etc.
```

---

## 📝 Manual Setup

### **Step 1: Create `.env` File**

Create a new file named `.env` in the project root:

```bash
touch .env
```

### **Step 2: Add Firebase Credentials**

Copy and paste this template into `.env`:

```env
# ====================================
# Firebase Configuration
# ====================================
REACT_APP_FIREBASE_API_KEY=YOUR_API_KEY_HERE
REACT_APP_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT_ID.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT_ID.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
REACT_APP_FIREBASE_APP_ID=YOUR_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID=YOUR_MEASUREMENT_ID

# ====================================
# API Configuration
# ====================================
REACT_APP_API_BASE_URL=https://us-central1-YOUR_PROJECT_ID.cloudfunctions.net/api

# ====================================
# App Configuration
# ====================================
REACT_APP_APP_NAME=React Todo App
REACT_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development

# ====================================
# Feature Flags
# ====================================
REACT_APP_ENABLE_PWA=true
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_OFFLINE_MODE=true

# ====================================
# Development Settings
# ====================================
GENERATE_SOURCEMAP=true
SKIP_PREFLIGHT_CHECK=true
```

### **Step 3: Replace Placeholders**

Replace `YOUR_*` placeholders with actual values from Firebase Console.

---

## 🔑 Getting Firebase Credentials

### **1. Go to Firebase Console**

Visit: [https://console.firebase.google.com](https://console.firebase.google.com)

### **2. Select Your Project**

Click on your project (e.g., "mytodoapp2025")

### **3. Navigate to Project Settings**

Click the **gear icon** ⚙️ → **Project settings**

### **4. Find Your Config**

Scroll down to **"Your apps"** section → Select your web app → **Config**

### **5. Copy Credentials**

You'll see something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "mytodoapp2025.firebaseapp.com",
  projectId: "mytodoapp2025",
  storageBucket: "mytodoapp2025.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
  measurementId: "G-XXXXXXXXXX"
};
```

### **6. Map to Environment Variables**

| Firebase Config | Environment Variable |
|----------------|---------------------|
| `apiKey` | `REACT_APP_FIREBASE_API_KEY` |
| `authDomain` | `REACT_APP_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `REACT_APP_FIREBASE_PROJECT_ID` |
| `storageBucket` | `REACT_APP_FIREBASE_STORAGE_BUCKET` |
| `messagingSenderId` | `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` |
| `appId` | `REACT_APP_FIREBASE_APP_ID` |
| `measurementId` | `REACT_APP_FIREBASE_MEASUREMENT_ID` |

---

## ✅ Verification

### **1. Restart Development Server**

```bash
# Stop the current server (Ctrl+C)
# Clear cache and restart
rm -rf node_modules/.cache
npm start
```

### **2. Check Browser Console**

You should see these messages:

```
✅ Firebase environment variables loaded successfully
🔥 Firebase Configuration Status: {
  projectId: 'mytodoapp2025',
  authDomain: 'mytodoapp2025.firebaseapp.com',
  hasApiKey: true,
  hasAppId: true
}
✅ Firebase initialized successfully
```

### **3. Test Authentication**

- Try to sign up for a new account
- Try to log in
- Create a todo item
- Check if todos sync in real-time

### **4. Verify in Firebase Console**

- Go to **Authentication** → Users (should see new users)
- Go to **Firestore Database** → Data (should see todos collection)

---

## 🐛 Troubleshooting

### **Issue: "Missing Firebase environment variables"**

**Cause:** `.env` file not created or has wrong variable names

**Solution:**
```bash
# 1. Check if .env exists
ls -la | grep .env

# 2. Verify variable names (must start with REACT_APP_)
cat .env | grep REACT_APP_FIREBASE

# 3. Restart server after creating/editing .env
npm start
```

---

### **Issue: "Firebase initialization error"**

**Cause:** Invalid credentials or typos in `.env`

**Solution:**
```bash
# 1. Double-check credentials in Firebase Console
# 2. Ensure no extra spaces or quotes in .env
# 3. Verify project ID matches
# 4. Clear cache and restart
rm -rf node_modules/.cache && npm start
```

---

### **Issue: "Environment variables not loading"**

**Cause:** Changes to `.env` require server restart

**Solution:**
```bash
# Always restart after editing .env
# Ctrl+C to stop
npm start
```

---

### **Issue: "Authentication not working"**

**Cause:** Firebase Authentication not enabled

**Solution:**
1. Go to Firebase Console → Authentication
2. Click **Get Started**
3. Enable **Email/Password** sign-in method
4. Save and retry

---

## 🚀 Production Deployment

### **Important: DO NOT commit `.env` to Git!**

The `.env` file is already in `.gitignore` to prevent accidental commits.

### **For Different Platforms:**

#### **Vercel**

1. Go to your project → Settings → Environment Variables
2. Add each variable (without `REACT_APP_` prefix shows up as `REACT_APP_*` in build)
3. Redeploy

```bash
vercel env add REACT_APP_FIREBASE_API_KEY production
vercel env add REACT_APP_FIREBASE_AUTH_DOMAIN production
# ... add all variables
```

#### **Netlify**

1. Site Settings → Build & Deploy → Environment
2. Click "Edit variables"
3. Add each `REACT_APP_*` variable
4. Save and redeploy

#### **Firebase Hosting**

1. Use Firebase CLI to set environment variables:
```bash
firebase functions:config:set firebase.api_key="YOUR_KEY"
firebase deploy
```

2. Or use `.env.production` file (not committed):
```bash
cp env.example .env.production
# Edit .env.production with production credentials
npm run build
firebase deploy
```

#### **GitHub Actions (CI/CD)**

Add to your `.github/workflows/deploy.yml`:

```yaml
env:
  REACT_APP_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
  # ... add all variables
```

Then add secrets in: Repository → Settings → Secrets and variables → Actions

---

## 🔒 Security Best Practices

### ✅ **DO:**

- ✅ Use environment variables for all credentials
- ✅ Add `.env` to `.gitignore`
- ✅ Use different Firebase projects for dev/staging/production
- ✅ Rotate API keys regularly
- ✅ Enable Firebase Security Rules
- ✅ Use Firebase App Check for production

### ❌ **DON'T:**

- ❌ Commit `.env` file to Git
- ❌ Share `.env` file via email/chat
- ❌ Use production credentials in development
- ❌ Hardcode credentials in source code
- ❌ Expose credentials in client-side code (without proper restrictions)

---

## 📚 Additional Resources

- [Firebase Setup Documentation](https://firebase.google.com/docs/web/setup)
- [Create React App Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)

---

## 💡 Quick Reference

### **Environment Variable Naming**

In Create React App, environment variables **MUST** start with `REACT_APP_`:

```env
✅ REACT_APP_FIREBASE_API_KEY=xxx     # Correct
❌ FIREBASE_API_KEY=xxx               # Won't work
❌ firebase_api_key=xxx               # Won't work
```

### **Accessing in Code**

```javascript
// Access environment variables
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;

// Check if variable exists
if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  console.error('Missing API key!');
}
```

### **File Priority**

If multiple env files exist, Create React App loads them in this order:

1. `.env.local` (highest priority)
2. `.env.development` / `.env.production` (depends on NODE_ENV)
3. `.env` (lowest priority)

---

## 🆘 Need Help?

If you're still having issues:

1. Check the browser console for error messages
2. Verify all variables are set correctly
3. Ensure Firebase project is properly configured
4. Review Firebase Security Rules
5. Check Firebase Usage & Billing (if applicable)

---

**Last Updated:** October 2025  
**Version:** 1.0.0

---

✨ **Your Firebase configuration is now secure and production-ready!** 🎉

