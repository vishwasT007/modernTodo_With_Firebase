# ✅ Deployment Checklist

Quick checklist to deploy your app step-by-step.

---

## 📦 Pre-Deployment Setup

### **Environment Variables**
- [ ] Run `./setup-env.sh` to create `.env` file
- [ ] Verify `.env` contains all Firebase credentials
- [ ] Check `.env` is in `.gitignore` (should already be)

### **Local Testing**
- [ ] Run `npm start` - App loads without errors
- [ ] Sign up new user works
- [ ] Login works
- [ ] Create todo works
- [ ] Edit todo works
- [ ] Delete todo works
- [ ] Real-time sync works
- [ ] No errors in browser console

### **Code Quality**
- [ ] Run `npm run lint` - No errors
- [ ] Run `npm run type-check` - No errors
- [ ] Run `npm test` - All tests pass
- [ ] Run `npm run build` - Build succeeds

---

## 🐙 GitHub Setup

### **Repository**
- [ ] Create GitHub repository
- [ ] Repository is public (for free Actions minutes)
- [ ] Run `git init` (if needed)
- [ ] Run `git add .`
- [ ] Run `git commit -m "feat: initial commit with CI/CD"`
- [ ] Run `git remote add origin [YOUR_REPO_URL]`
- [ ] Run `git branch -M main`
- [ ] Run `git push -u origin main`

### **GitHub Secrets**
Go to: `Repository → Settings → Secrets and variables → Actions`

**Firebase Credentials:**
- [ ] `REACT_APP_FIREBASE_API_KEY`
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- [ ] `REACT_APP_FIREBASE_APP_ID`
- [ ] `REACT_APP_FIREBASE_MEASUREMENT_ID`
- [ ] `REACT_APP_API_BASE_URL`

**Firebase Deployment:**
- [ ] Run `firebase login:ci` to get token
- [ ] Add `FIREBASE_TOKEN` secret
- [ ] Download service account JSON from Firebase Console
- [ ] Add `FIREBASE_SERVICE_ACCOUNT` secret (entire JSON)
- [ ] Add `FIREBASE_PROJECT_ID` secret

---

## 🔥 Firebase Deployment

### **CLI Setup**
- [ ] Run `npm install -g firebase-tools`
- [ ] Run `firebase login`
- [ ] Run `firebase use mytodoapp2025`
- [ ] Verify `firebase.json` exists

### **Deploy**
- [ ] Run `./deploy.sh firebase` OR `npm run deploy:firebase`
- [ ] Wait for deployment to complete
- [ ] Copy the deployment URL
- [ ] Open URL in browser
- [ ] Test the deployed app

### **Firebase Console Check**
- [ ] Go to Firebase Console → Hosting
- [ ] Verify deployment is listed
- [ ] Check deployment time/date
- [ ] View deployment URL

---

## 🤖 CI/CD Verification

### **GitHub Actions**
- [ ] Go to `Repository → Actions` tab
- [ ] Verify workflows are visible:
  - [ ] 🚀 CI Pipeline
  - [ ] 🔥 Deploy to Firebase Hosting
  - [ ] ▲ Deploy to Vercel
  - [ ] 🌐 Deploy to Netlify

### **Test Automation**
- [ ] Edit `README.md` (add a test line)
- [ ] Run `git add README.md`
- [ ] Run `git commit -m "test: verify CI/CD"`
- [ ] Run `git push origin main`
- [ ] Go to Actions tab
- [ ] Watch workflows run
- [ ] Verify all checks pass (green checkmarks)
- [ ] Verify auto-deployment completes

---

## ▲ Vercel Deployment (Optional)

### **Setup**
- [ ] Run `npm install -g vercel`
- [ ] Run `vercel login`
- [ ] Run `vercel link`
- [ ] Note `orgId` and `projectId` from `.vercel/project.json`

### **Get Token**
- [ ] Go to Vercel Dashboard → Settings → Tokens
- [ ] Create token: "GitHub Actions"
- [ ] Copy token

### **GitHub Secrets**
- [ ] Add `VERCEL_TOKEN`
- [ ] Add `VERCEL_ORG_ID`
- [ ] Add `VERCEL_PROJECT_ID`

### **Deploy**
- [ ] Run `./deploy.sh vercel` OR `npm run deploy:vercel`
- [ ] Copy deployment URL
- [ ] Test deployed app

---

## 🌐 Netlify Deployment (Optional)

### **Setup**
- [ ] Run `npm install -g netlify-cli`
- [ ] Run `netlify login`
- [ ] Run `netlify init`
- [ ] Run `netlify status` to get Site ID

### **Get Token**
- [ ] Go to Netlify → User Settings → Applications
- [ ] Create token: "GitHub Actions"
- [ ] Copy token

### **GitHub Secrets**
- [ ] Add `NETLIFY_AUTH_TOKEN`
- [ ] Add `NETLIFY_SITE_ID`

### **Deploy**
- [ ] Run `./deploy.sh netlify` OR `npm run deploy:netlify`
- [ ] Copy deployment URL
- [ ] Test deployed app

---

## ✅ Post-Deployment Verification

### **Live Site Testing**
- [ ] Site loads without errors
- [ ] Sign up works
- [ ] Login works
- [ ] Create todo works
- [ ] Edit todo works
- [ ] Delete todo works
- [ ] Logout works
- [ ] Responsive design works (test on mobile)
- [ ] PWA features work (offline, install)

### **Firebase Console**
- [ ] Authentication → Users shows registered users
- [ ] Firestore Database → todos collection has data
- [ ] Hosting → Shows recent deployment
- [ ] Usage shows activity

### **Performance Check**
- [ ] Run Lighthouse audit (90+ scores)
- [ ] Check page load speed (< 3 seconds)
- [ ] Check mobile usability
- [ ] Check PWA score

---

## 🎯 Final Checklist

### **Documentation**
- [ ] README.md is up to date
- [ ] Add deployment URLs to README
- [ ] Add badges to README (optional)
- [ ] All documentation files present:
  - [ ] STEP_BY_STEP_GUIDE.md
  - [ ] DEPLOYMENT.md
  - [ ] CICD_SETUP.md
  - [ ] ENVIRONMENT_SETUP.md
  - [ ] QUICK_DEPLOY.md

### **Security**
- [ ] `.env` file NOT committed to Git
- [ ] No API keys in source code
- [ ] Firebase security rules deployed
- [ ] Authorized domains configured in Firebase
- [ ] GitHub secrets properly set

### **Portfolio Ready**
- [ ] GitHub repo is clean and organized
- [ ] README has good description
- [ ] Screenshots in repo (optional)
- [ ] Live demo links work
- [ ] Code is well-commented
- [ ] Commit messages are meaningful

---

## 📸 Screenshots to Take

For your portfolio/resume:

- [ ] GitHub Actions workflows running (green checkmarks)
- [ ] Deployed app homepage
- [ ] Todo list with items
- [ ] Firebase Console showing deployment
- [ ] Mobile responsive view
- [ ] Lighthouse scores

---

## 🎊 Success Criteria

You're done when ALL of these are true:

✅ **Local Development**
- App runs locally without errors
- All features work
- Tests pass
- Build succeeds

✅ **Version Control**
- Code on GitHub
- Clean commit history
- .env file not committed

✅ **CI/CD**
- GitHub Actions workflows configured
- All secrets added
- Workflows run automatically on push
- All checks pass

✅ **Deployment**
- App deployed to at least one platform (Firebase)
- Live URL accessible
- All features work on live site
- No console errors

✅ **Quality**
- No linting errors
- No TypeScript errors
- Tests pass
- Security audit clean

✅ **Documentation**
- All guides present
- README updated
- Deployment instructions clear

---

## 🚨 Common Issues & Quick Fixes

### **Issue: Can't push to GitHub**
```bash
git pull origin main --rebase
git push origin main
```

### **Issue: Workflow fails**
```bash
# Check GitHub Actions logs
# Fix errors locally first
npm run lint
npm run type-check
npm test
npm run build
```

### **Issue: Deployment fails**
```bash
# Check secrets are set correctly
# Verify Firebase token is valid
firebase login:ci  # Get new token
```

### **Issue: App shows blank page**
```bash
# Check browser console
# Verify environment variables
# Check Firebase authorized domains
```

---

## ⏱️ Time Estimates

- [ ] Environment setup: **5 minutes**
- [ ] Local testing: **5 minutes**
- [ ] GitHub setup: **10 minutes**
- [ ] GitHub secrets: **10 minutes**
- [ ] Firebase deployment: **5 minutes**
- [ ] CI/CD verification: **5 minutes**
- [ ] Post-deployment testing: **5 minutes**

**Total: ~45 minutes** ⏰

---

## 🎉 Completion

When you check off ALL boxes above:

🏆 **Congratulations!**

You have successfully:
- ✅ Deployed a production-ready React app
- ✅ Set up automated CI/CD pipeline
- ✅ Configured multi-platform deployment
- ✅ Demonstrated DevOps skills
- ✅ Created a portfolio-worthy project

---

## 📋 Interview Prep

Can you answer these?

- [ ] "How did you deploy your app?"
- [ ] "Explain your CI/CD pipeline"
- [ ] "How do you handle environment variables?"
- [ ] "What checks run before deployment?"
- [ ] "How do you rollback a bad deployment?"
- [ ] "What's your deployment frequency?"

If yes to all → **You're interview ready!** 🚀

---

**Print this checklist and check off items as you go!** ✏️

