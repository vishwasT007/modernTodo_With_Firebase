# 🤖 CI/CD Setup Guide

Complete guide to setting up Continuous Integration and Continuous Deployment for your React Todo App.

## 📋 Table of Contents

- [Overview](#overview)
- [GitHub Actions Setup](#github-actions-setup)
- [Secrets Configuration](#secrets-configuration)
- [Workflow Details](#workflow-details)
- [Branch Strategy](#branch-strategy)
- [Deployment Environments](#deployment-environments)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This project includes **4 GitHub Actions workflows**:

1. **`ci.yml`** - Continuous Integration (runs on every push/PR)
2. **`deploy-firebase.yml`** - Deploy to Firebase Hosting
3. **`deploy-vercel.yml`** - Deploy to Vercel
4. **`deploy-netlify.yml`** - Deploy to Netlify

---

## 🚀 GitHub Actions Setup

### **Step 1: Push Code to GitHub**

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit with CI/CD setup"

# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main
```

### **Step 2: Verify Workflows**

1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. You should see the workflows listed

---

## 🔐 Secrets Configuration

### **Required Secrets for All Platforms**

Go to: **Repository → Settings → Secrets and variables → Actions → New repository secret**

#### **Firebase Environment Variables:**

```
Secret Name: REACT_APP_FIREBASE_API_KEY
Value: AIzaSyDMJDqiGrIrdAFtU9jsaCOSg7Wj5PTUL6M

Secret Name: REACT_APP_FIREBASE_AUTH_DOMAIN
Value: mytodoapp2025.firebaseapp.com

Secret Name: REACT_APP_FIREBASE_PROJECT_ID
Value: mytodoapp2025

Secret Name: REACT_APP_FIREBASE_STORAGE_BUCKET
Value: mytodoapp2025.firebasestorage.app

Secret Name: REACT_APP_FIREBASE_MESSAGING_SENDER_ID
Value: 38039075363

Secret Name: REACT_APP_FIREBASE_APP_ID
Value: 1:38039075363:web:6e69aa9b609a0ab9644f96

Secret Name: REACT_APP_FIREBASE_MEASUREMENT_ID
Value: (leave empty if not using Analytics)

Secret Name: REACT_APP_API_BASE_URL
Value: https://us-central1-mytodoapp2025.cloudfunctions.net/api
```

---

### **Additional Secrets for Firebase Deployment**

#### **1. Get Firebase Token**

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and get CI token
firebase login:ci
```

Copy the token and add it as a secret:

```
Secret Name: FIREBASE_TOKEN
Value: [your-firebase-token]
```

#### **2. Get Firebase Service Account**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Settings (gear icon) → Service accounts
4. Click "Generate new private key"
5. Download the JSON file
6. Copy the **entire JSON content**

Add as secret:

```
Secret Name: FIREBASE_SERVICE_ACCOUNT
Value: [paste entire JSON content]
```

Example format:
```json
{
  "type": "service_account",
  "project_id": "your-project",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...",
  "client_id": "...",
  "auth_uri": "...",
  "token_uri": "...",
  "auth_provider_x509_cert_url": "...",
  "client_x509_cert_url": "..."
}
```

---

### **Additional Secrets for Vercel Deployment**

#### **1. Get Vercel Token**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Settings → Tokens
3. Create new token
4. Name it "GitHub Actions"
5. Copy the token

```
Secret Name: VERCEL_TOKEN
Value: [your-vercel-token]
```

#### **2. Get Vercel Org ID and Project ID**

```bash
# Install Vercel CLI
npm install -g vercel

# Link your project (run in project directory)
vercel link

# This creates .vercel/project.json
cat .vercel/project.json
```

Copy the values:

```
Secret Name: VERCEL_ORG_ID
Value: [orgId from project.json]

Secret Name: VERCEL_PROJECT_ID
Value: [projectId from project.json]
```

---

### **Additional Secrets for Netlify Deployment**

#### **1. Get Netlify Auth Token**

1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. User settings → Applications → Personal access tokens
3. Click "New access token"
4. Name it "GitHub Actions"
5. Copy the token

```
Secret Name: NETLIFY_AUTH_TOKEN
Value: [your-netlify-token]
```

#### **2. Get Netlify Site ID**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Link your site
netlify link

# Get site ID
netlify status
```

Or from dashboard:
1. Go to your site
2. Settings → General → Site details → API ID

```
Secret Name: NETLIFY_SITE_ID
Value: [your-site-id]
```

---

## 📊 Workflow Details

### **1. CI Workflow (`ci.yml`)**

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`

**Jobs:**
1. **Lint** - ESLint and code formatting check
2. **Type Check** - TypeScript type checking
3. **Test** - Unit and integration tests with coverage
4. **Build** - Production build verification
5. **Security** - npm audit for vulnerabilities
6. **Success** - Summary job

**When it runs:**
```bash
# Automatically on push
git push origin main

# Automatically on pull request
git push origin feature-branch
# Then create PR on GitHub
```

**What it does:**
- ✅ Ensures code quality
- ✅ Catches bugs early
- ✅ Prevents broken code from being deployed
- ✅ Generates test coverage reports
- ✅ Identifies security vulnerabilities

---

### **2. Firebase Deploy Workflow (`deploy-firebase.yml`)**

**Triggers:**
- Push to `main` branch
- Manual trigger (workflow_dispatch)

**Jobs:**
1. **Deploy** - Build and deploy to Firebase Hosting
2. **Deploy Firestore** - Deploy Firestore rules and indexes

**Manual trigger:**
1. Go to Actions tab
2. Select "Deploy to Firebase Hosting"
3. Click "Run workflow"
4. Select branch
5. Click "Run workflow" button

**Environment:**
- Live channel on Firebase Hosting
- URL: `https://YOUR_PROJECT_ID.web.app`

---

### **3. Vercel Deploy Workflow (`deploy-vercel.yml`)**

**Triggers:**
- Push to `main` branch → Production
- Pull requests → Preview deployment
- Manual trigger

**Jobs:**
1. **Preview Deploy** - Preview deployment for PRs
2. **Production Deploy** - Production deployment for main

**Features:**
- ✅ Automatic preview URLs for PRs
- ✅ Comments on PR with preview link
- ✅ Production deployment on merge
- ✅ Instant rollbacks

---

### **4. Netlify Deploy Workflow (`deploy-netlify.yml`)**

**Triggers:**
- Push to `main` branch
- Pull requests
- Manual trigger

**Jobs:**
1. **Deploy** - Build and deploy to Netlify

**Features:**
- ✅ Deploy previews for PRs
- ✅ Production deployment on main
- ✅ Branch deploys

---

## 🌿 Branch Strategy

### **Recommended Git Flow**

```
main (production)
  ↑
develop (staging)
  ↑
feature/xyz (feature branch)
```

### **Branch Configuration**

#### **`main` branch:**
- Protected
- Requires PR review
- CI must pass
- Auto-deploys to production

#### **`develop` branch:**
- Protected
- Requires PR review
- CI must pass
- Auto-deploys to staging

#### **Feature branches:**
- Created from `develop`
- Naming: `feature/description`, `fix/bug-name`, `chore/task`
- Merged back to `develop` via PR

### **Setup Branch Protection**

1. Repository → Settings → Branches
2. Add branch protection rule for `main`:
   - ✅ Require pull request reviews before merging
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - ✅ Include administrators

---

## 🌍 Deployment Environments

### **Environment Setup**

Create three deployment environments:

#### **1. Production (main branch)**
- Firebase: Main project
- Vercel: Production
- Netlify: Production
- URL: `https://yourdomain.com`

#### **2. Staging (develop branch)**
- Firebase: Preview channel
- Vercel: Preview
- Netlify: Branch deploy
- URL: `https://develop--yourdomain.netlify.app`

#### **3. Development (feature branches)**
- Local only
- Preview deployments for testing

### **Firebase Hosting Channels**

```bash
# Create preview channel for staging
firebase hosting:channel:deploy staging --expires 30d

# View active channels
firebase hosting:channel:list
```

---

## ✅ Best Practices

### **1. Commit Messages**

Use conventional commits:

```bash
feat: add new todo feature
fix: resolve authentication bug
docs: update README
style: format code
refactor: improve performance
test: add unit tests
chore: update dependencies
```

### **2. Pull Request Process**

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Make changes and commit
git add .
git commit -m "feat: add new feature"

# 3. Push to GitHub
git push origin feature/new-feature

# 4. Create PR on GitHub
# 5. Wait for CI to pass
# 6. Request review
# 7. Merge after approval
```

### **3. Code Review Checklist**

- ✅ All tests pass
- ✅ No linting errors
- ✅ Code is documented
- ✅ No console.logs or debuggers
- ✅ Environment variables not hardcoded
- ✅ Responsive design tested
- ✅ Accessibility checked

### **4. Testing Before Push**

```bash
# Run all checks locally
npm run lint
npm run type-check
npm test
npm run build

# Fix any issues before pushing
```

### **5. Security**

- ✅ Never commit `.env` file
- ✅ Use GitHub Secrets for sensitive data
- ✅ Rotate tokens regularly
- ✅ Review npm audit warnings
- ✅ Keep dependencies updated

---

## 🐛 Troubleshooting

### **Issue: CI Fails with "Missing Environment Variables"**

**Solution:**
1. Check that all secrets are added in GitHub
2. Secret names match exactly (case-sensitive)
3. No extra spaces in secret values
4. Workflow file references correct secret names

---

### **Issue: Firebase Deploy Fails with "Authentication Error"**

**Solution:**
1. Regenerate Firebase token:
   ```bash
   firebase login:ci
   ```
2. Update `FIREBASE_TOKEN` secret in GitHub
3. Verify Firebase project ID is correct

---

### **Issue: Vercel Deploy Fails with "Project Not Found"**

**Solution:**
1. Run `vercel link` locally
2. Copy org and project IDs from `.vercel/project.json`
3. Update secrets in GitHub
4. Ensure Vercel token has correct permissions

---

### **Issue: Tests Fail in CI But Pass Locally**

**Possible causes:**
1. Different Node.js versions
2. Missing dependencies
3. Timezone differences
4. Environment variables not set

**Solution:**
```bash
# Match CI environment locally
npm ci  # instead of npm install
CI=true npm test  # run tests in CI mode
```

---

### **Issue: Build Succeeds Locally But Fails in CI**

**Solution:**
1. Clear local cache:
   ```bash
   rm -rf node_modules/.cache
   ```
2. Check for OS-specific code
3. Verify all dependencies are in `package.json`
4. Check for hardcoded paths

---

### **Issue: Workflow Doesn't Trigger**

**Checklist:**
- ✅ Workflow file in `.github/workflows/`
- ✅ File has `.yml` extension
- ✅ YAML syntax is valid
- ✅ Branch name matches trigger configuration
- ✅ GitHub Actions enabled for repository

**Validate YAML:**
```bash
# Install yamllint
pip install yamllint

# Validate workflow file
yamllint .github/workflows/ci.yml
```

---

## 📊 Monitoring CI/CD

### **View Workflow Runs**

1. Repository → Actions tab
2. Click on a workflow
3. View logs for each job

### **Monitor Metrics**

Track these metrics:
- ✅ Build success rate
- ✅ Average build time
- ✅ Test coverage trend
- ✅ Deployment frequency
- ✅ Time to deploy

### **Notifications**

Enable GitHub notifications:
1. Repository → Settings → Notifications
2. Configure email notifications
3. Add Slack/Discord webhooks (optional)

---

## 🎯 Next Steps

After setting up CI/CD:

1. **Add Status Badges**
   ```markdown
   ![CI](https://github.com/user/repo/workflows/CI/badge.svg)
   ```

2. **Set Up Code Coverage**
   - Codecov integration
   - Coverage reports in PRs

3. **Add More Checks**
   - Lighthouse CI
   - Bundle size monitoring
   - Performance regression tests

4. **Automate More**
   - Auto-merge dependabot PRs
   - Auto-close stale issues
   - Auto-label PRs

---

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Firebase CI/CD](https://firebase.google.com/docs/hosting/github-integration)
- [Vercel CI/CD](https://vercel.com/docs/concepts/git)
- [Netlify CI/CD](https://docs.netlify.com/configure-builds/overview/)

---

**Last Updated:** October 2025  
**Version:** 1.0.0

---

✨ **Your CI/CD pipeline is now ready!** 🚀

