#!/bin/bash

# ==============================================================================
# Universal Deployment Script for React Todo App
# ==============================================================================
# This script helps you deploy to various platforms
#
# Usage:
#   chmod +x deploy.sh
#   ./deploy.sh [platform]
#
# Platforms: firebase, vercel, netlify, github-pages
# ==============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Display banner
echo ""
echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║          🚀 React Todo App Deployment Script                  ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check environment variables
check_env_vars() {
    echo -e "${BLUE}🔍 Checking environment variables...${NC}"
    
    required_vars=(
        "REACT_APP_FIREBASE_API_KEY"
        "REACT_APP_FIREBASE_AUTH_DOMAIN"
        "REACT_APP_FIREBASE_PROJECT_ID"
        "REACT_APP_FIREBASE_STORAGE_BUCKET"
        "REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
        "REACT_APP_FIREBASE_APP_ID"
    )
    
    missing_vars=()
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            missing_vars+=("$var")
        fi
    done
    
    if [ ${#missing_vars[@]} -gt 0 ]; then
        echo -e "${RED}❌ Missing required environment variables:${NC}"
        for var in "${missing_vars[@]}"; do
            echo -e "   ${RED}• $var${NC}"
        done
        echo ""
        echo -e "${YELLOW}💡 Make sure your .env file exists and contains all required variables${NC}"
        return 1
    fi
    
    echo -e "${GREEN}✅ All environment variables are set${NC}"
    echo ""
}

# Function to run tests
run_tests() {
    echo -e "${BLUE}🧪 Running tests...${NC}"
    
    if npm run test:ci; then
        echo -e "${GREEN}✅ Tests passed${NC}"
        echo ""
    else
        echo -e "${RED}❌ Tests failed${NC}"
        read -p "Continue anyway? (y/N): " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
        echo ""
    fi
}

# Function to build the application
build_app() {
    echo -e "${BLUE}🏗️  Building application...${NC}"
    
    # Clean previous build
    rm -rf build
    
    # Build the app
    if npm run build; then
        echo -e "${GREEN}✅ Build successful${NC}"
        echo ""
        
        # Show build size
        echo -e "${CYAN}📦 Build size:${NC}"
        du -sh build
        echo ""
    else
        echo -e "${RED}❌ Build failed${NC}"
        exit 1
    fi
}

# Function to deploy to Firebase
deploy_firebase() {
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                 🔥 Firebase Hosting Deployment                 ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if Firebase CLI is installed
    if ! command_exists firebase; then
        echo -e "${YELLOW}⚠️  Firebase CLI not found${NC}"
        read -p "Install Firebase CLI? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g firebase-tools
        else
            echo -e "${RED}❌ Firebase CLI is required for deployment${NC}"
            exit 1
        fi
    fi
    
    # Check if logged in
    echo -e "${BLUE}🔐 Checking Firebase authentication...${NC}"
    if ! firebase projects:list >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
        firebase login
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to Firebase Hosting...${NC}"
    firebase deploy --only hosting
    
    echo ""
    echo -e "${GREEN}✅ Firebase deployment complete!${NC}"
    echo -e "${CYAN}🌐 Your app is live at: https://${REACT_APP_FIREBASE_PROJECT_ID}.web.app${NC}"
    echo ""
}

# Function to deploy to Vercel
deploy_vercel() {
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                    ▲ Vercel Deployment                         ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if Vercel CLI is installed
    if ! command_exists vercel; then
        echo -e "${YELLOW}⚠️  Vercel CLI not found${NC}"
        read -p "Install Vercel CLI? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g vercel
        else
            echo -e "${RED}❌ Vercel CLI is required for deployment${NC}"
            exit 1
        fi
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to Vercel...${NC}"
    
    read -p "Deploy to production? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        vercel --prod
    else
        vercel
    fi
    
    echo ""
    echo -e "${GREEN}✅ Vercel deployment complete!${NC}"
    echo ""
}

# Function to deploy to Netlify
deploy_netlify() {
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                    🌐 Netlify Deployment                       ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if Netlify CLI is installed
    if ! command_exists netlify; then
        echo -e "${YELLOW}⚠️  Netlify CLI not found${NC}"
        read -p "Install Netlify CLI? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install -g netlify-cli
        else
            echo -e "${RED}❌ Netlify CLI is required for deployment${NC}"
            exit 1
        fi
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to Netlify...${NC}"
    
    read -p "Deploy to production? (y/N): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        netlify deploy --prod --dir=build
    else
        netlify deploy --dir=build
    fi
    
    echo ""
    echo -e "${GREEN}✅ Netlify deployment complete!${NC}"
    echo ""
}

# Function to deploy to GitHub Pages
deploy_github_pages() {
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                  📄 GitHub Pages Deployment                    ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check if gh-pages is installed
    if ! npm list gh-pages >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  gh-pages package not found${NC}"
        read -p "Install gh-pages? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            npm install --save-dev gh-pages
        else
            echo -e "${RED}❌ gh-pages is required for deployment${NC}"
            exit 1
        fi
    fi
    
    # Add homepage to package.json if not exists
    if ! grep -q '"homepage"' package.json; then
        echo -e "${YELLOW}⚠️  'homepage' field not found in package.json${NC}"
        read -p "Add homepage field? (y/N): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Get repository name from git
            REPO_NAME=$(basename `git rev-parse --show-toplevel`)
            GIT_USER=$(git config user.name)
            
            # Update package.json
            node -e "const pkg=require('./package.json'); pkg.homepage='https://${GIT_USER}.github.io/${REPO_NAME}'; require('fs').writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
            
            echo -e "${GREEN}✅ Added homepage: https://${GIT_USER}.github.io/${REPO_NAME}${NC}"
        fi
    fi
    
    # Deploy
    echo -e "${BLUE}🚀 Deploying to GitHub Pages...${NC}"
    npm run deploy
    
    echo ""
    echo -e "${GREEN}✅ GitHub Pages deployment complete!${NC}"
    echo ""
}

# Main deployment function
main() {
    # Check if .env file exists
    if [ ! -f .env ]; then
        echo -e "${RED}❌ .env file not found${NC}"
        echo -e "${YELLOW}💡 Run './setup-env.sh' first to set up environment variables${NC}"
        exit 1
    fi
    
    # Load environment variables
    export $(cat .env | xargs)
    
    # Check environment variables
    check_env_vars || exit 1
    
    # Get deployment platform
    PLATFORM=$1
    
    if [ -z "$PLATFORM" ]; then
        echo -e "${BLUE}Select deployment platform:${NC}"
        echo ""
        echo "  1) Firebase Hosting"
        echo "  2) Vercel"
        echo "  3) Netlify"
        echo "  4) GitHub Pages"
        echo "  5) Exit"
        echo ""
        read -p "Enter your choice (1-5): " -n 1 -r
        echo ""
        
        case $REPLY in
            1) PLATFORM="firebase";;
            2) PLATFORM="vercel";;
            3) PLATFORM="netlify";;
            4) PLATFORM="github-pages";;
            5) exit 0;;
            *) echo -e "${RED}Invalid choice${NC}"; exit 1;;
        esac
    fi
    
    # Run tests
    read -p "Run tests before deployment? (Y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Nn]$ ]]; then
        run_tests
    fi
    
    # Build application
    build_app
    
    # Deploy based on platform
    case $PLATFORM in
        firebase)
            deploy_firebase
            ;;
        vercel)
            deploy_vercel
            ;;
        netlify)
            deploy_netlify
            ;;
        github-pages|gh-pages)
            deploy_github_pages
            ;;
        *)
            echo -e "${RED}❌ Unknown platform: $PLATFORM${NC}"
            echo -e "${YELLOW}Available platforms: firebase, vercel, netlify, github-pages${NC}"
            exit 1
            ;;
    esac
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║               🎉 Deployment Successful!                        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# Run main function
main "$@"

