# 🎯 Command Reference

Quick copy-paste commands for deployment and CI/CD setup.

---

## 🔧 Setup Commands

### **Environment Setup**
```bash
# Create .env file
./setup-env.sh

# Verify .env exists
ls -la | grep .env

# Check environment variables
cat .env
```

### **Install Dependencies**
```bash
# Install project dependencies
npm install

# Install global tools
npm install -g firebase-tools vercel netlify-cli gh-pages
```

---

## 🧪 Testing Commands

### **Run Tests**
```bash
# Run tests in watch mode
npm test

# Run tests once with coverage
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### **Code Quality**
```bash
# Lint code
npm run lint

# Fix linting errors
npm run lint:fix

# Check code formatting
npm run format:check

# Format code
npm run format

# TypeScript type check
npm run type-check
```

### **Build**
```bash
# Development build
npm run build

# Production build (no source maps)
npm run build:prod

# Analyze bundle size
npm run analyze
```

---

## 🐙 Git Commands

### **Initial Setup**
```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "feat: initial commit with CI/CD setup"

# Add remote repository (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/react-todo-app-firebase.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

### **Daily Workflow**
```bash
# Check status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat: add new feature"

# Push to GitHub
git push origin main

# Pull latest changes
git pull origin main
```

### **Branch Management**
```bash
# Create feature branch
git checkout -b feature/new-feature

# Switch branches
git checkout main

# Merge feature branch
git merge feature/new-feature

# Delete branch
git branch -d feature/new-feature
```

---

## 🔥 Firebase Commands

### **Login & Setup**
```bash
# Login to Firebase
firebase login

# Logout
firebase logout

# Re-authenticate
firebase login --reauth

# List projects
firebase projects:list

# Select project
firebase use mytodoapp2025

# Get current project
firebase use
```

### **Initialize**
```bash
# Initialize Firebase
firebase init

# Initialize hosting only
firebase init hosting

# Initialize Firestore only
firebase init firestore
```

### **Deploy**
```bash
# Deploy everything
firebase deploy

# Deploy hosting only
firebase deploy --only hosting

# Deploy Firestore rules only
firebase deploy --only firestore:rules

# Deploy with npm script
npm run deploy:firebase
```

### **Hosting Management**
```bash
# List hosting sites
firebase hosting:sites:list

# Create preview channel
firebase hosting:channel:deploy staging --expires 30d

# List channels
firebase hosting:channel:list

# Delete channel
firebase hosting:channel:delete staging
```

### **Get CI Token**
```bash
# Get token for CI/CD
firebase login:ci
```

---

## ▲ Vercel Commands

### **Login & Setup**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Get project info
cat .vercel/project.json
```

### **Deploy**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# Deploy with npm script
npm run deploy:vercel
```

### **Environment Variables**
```bash
# Add environment variable
vercel env add VARIABLE_NAME production

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME production
```

### **Project Management**
```bash
# List projects
vercel projects ls

# Remove project
vercel remove PROJECT_NAME
```

---

## 🌐 Netlify Commands

### **Login & Setup**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Get site info
netlify status

# Open site in browser
netlify open
```

### **Deploy**
```bash
# Deploy to preview
netlify deploy

# Deploy to production
netlify deploy --prod

# Deploy with directory
netlify deploy --prod --dir=build

# Deploy with npm script
npm run deploy:netlify
```

### **Environment Variables**
```bash
# Set environment variable
netlify env:set VARIABLE_NAME "value"

# List environment variables
netlify env:list

# Get environment variable
netlify env:get VARIABLE_NAME

# Unset environment variable
netlify env:unset VARIABLE_NAME
```

### **Site Management**
```bash
# List sites
netlify sites:list

# Delete site
netlify sites:delete
```

---

## 📄 GitHub Pages Commands

### **Setup**
```bash
# Install gh-pages
npm install --save-dev gh-pages
```

### **Deploy**
```bash
# Deploy to GitHub Pages
npm run deploy

# Force deploy
npm run deploy -- --force
```

---

## 🤖 CI/CD Commands

### **Check Workflows**
```bash
# List workflow files
ls -la .github/workflows/

# View workflow file
cat .github/workflows/ci.yml
```

### **GitHub CLI (Optional)**
```bash
# Install GitHub CLI
# Ubuntu/Debian: sudo apt install gh
# Mac: brew install gh

# Login
gh auth login

# View workflow runs
gh run list

# View specific run
gh run view RUN_ID

# View run logs
gh run view RUN_ID --log
```

---

## 🧹 Cleanup Commands

### **Cache & Build**
```bash
# Clear build cache
rm -rf build

# Clear node modules cache
rm -rf node_modules/.cache

# Clear all caches
npm run clean

# Full reinstall
npm run reinstall
```

### **Git Cleanup**
```bash
# Remove untracked files (dry run)
git clean -n

# Remove untracked files
git clean -f

# Remove ignored files
git clean -fx

# Reset to last commit
git reset --hard HEAD
```

---

## 🔍 Debug Commands

### **Check Configuration**
```bash
# Check Node version
node --version

# Check npm version
npm --version

# Check git version
git --version

# List installed global packages
npm list -g --depth=0

# Check Firebase config
firebase projects:list
firebase use

# Check environment variables (in build)
npm run build
grep -r "REACT_APP_FIREBASE" build/
```

### **View Logs**
```bash
# Firebase logs
firebase deploy --debug

# npm debug logs
npm run build --verbose

# Check .env is loaded
npm start
# Then check browser console for Firebase init messages
```

---

## 📦 Package Management

### **Install Dependencies**
```bash
# Install all dependencies
npm install

# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Install global package
npm install -g package-name
```

### **Update Dependencies**
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm update package-name

# Update to latest (breaking changes)
npm install package-name@latest
```

### **Security**
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

---

## 🚀 Quick Deploy Sequences

### **First-Time Deploy to Firebase**
```bash
./setup-env.sh
npm install
npm test
npm run build
firebase login
firebase use mytodoapp2025
./deploy.sh firebase
```

### **Quick Re-Deploy**
```bash
npm run deploy:firebase
```

### **Deploy After Changes**
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
# GitHub Actions automatically deploys
```

### **Emergency Rollback (Firebase)**
```bash
# Go to Firebase Console → Hosting
# Click on previous deployment
# Click "Rollback"
```

---

## 📊 Performance Commands

### **Bundle Analysis**
```bash
# Analyze bundle size
npm run analyze

# Install webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

# Run analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

### **Lighthouse Audit**
```bash
# Install Lighthouse
npm install -g lighthouse

# Run audit
lighthouse https://your-app-url.com --view

# Run audit with specific categories
lighthouse https://your-app-url.com --only-categories=performance,accessibility,best-practices,seo,pwa --view
```

---

## 🔐 Security Commands

### **Generate Secrets**
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Firebase CI token
firebase login:ci
```

### **Check Security**
```bash
# npm audit
npm audit

# Check for leaked secrets (using git-secrets)
git secrets --scan

# Check .gitignore
cat .gitignore | grep .env
```

---

## 💡 Useful One-Liners

```bash
# Quick test before push
npm run lint && npm run type-check && npm test && npm run build

# Full cleanup and reinstall
rm -rf node_modules package-lock.json build && npm install

# Check if .env is accidentally tracked
git ls-files | grep .env

# Count lines of code
find src -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | xargs wc -l

# Find all TODO comments
grep -r "TODO" src/

# Check build size
du -sh build

# List all npm scripts
npm run
```

---

## 📋 Copy-Paste Sequences

### **Complete First-Time Setup**
```bash
cd /home/vishwas/Desktop/todoApp/React-Js-Todo-App-with-firebase-auth
./setup-env.sh
npm install
npm test
npm run build
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/react-todo-app-firebase.git
git push -u origin main
```

### **Deploy to All Platforms**
```bash
# Firebase
./deploy.sh firebase

# Vercel
./deploy.sh vercel

# Netlify
./deploy.sh netlify
```

### **Full Quality Check**
```bash
npm run lint
npm run lint:fix
npm run format
npm run type-check
npm run test:coverage
npm run build:prod
```

---

## 🎯 Platform-Specific URLs

### **Firebase Console**
```
https://console.firebase.google.com/project/mytodoapp2025
```

### **Vercel Dashboard**
```
https://vercel.com/dashboard
```

### **Netlify Dashboard**
```
https://app.netlify.com
```

### **GitHub Repository**
```
https://github.com/YOUR_USERNAME/react-todo-app-firebase
```

### **GitHub Actions**
```
https://github.com/YOUR_USERNAME/react-todo-app-firebase/actions
```

---

**💡 Pro Tip:** Bookmark this page for quick reference! 🔖

