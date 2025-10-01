#!/bin/bash

# ==============================================================================
# Environment Setup Script for React Todo App
# ==============================================================================
# This script helps you set up your .env file with Firebase credentials
#
# Usage:
#   chmod +x setup-env.sh
#   ./setup-env.sh
# ==============================================================================

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         🔥 Firebase Environment Configuration Setup           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if .env already exists
if [ -f .env ]; then
    echo -e "${YELLOW}⚠️  Warning: .env file already exists!${NC}"
    echo ""
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${BLUE}ℹ️  Setup cancelled. Existing .env file preserved.${NC}"
        exit 0
    fi
    echo ""
fi

# Copy env.example to .env
echo -e "${BLUE}📋 Copying env.example to .env...${NC}"
cp env.example .env

echo -e "${GREEN}✅ .env file created successfully!${NC}"
echo ""

# Provide instructions
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   📝 Next Steps                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "1. Get your Firebase credentials from:"
echo -e "   ${BLUE}https://console.firebase.google.com/project/YOUR_PROJECT/settings/general${NC}"
echo ""
echo "2. Edit the .env file with your actual Firebase credentials:"
echo -e "   ${YELLOW}nano .env${NC}  or  ${YELLOW}vim .env${NC}  or use your preferred editor"
echo ""
echo "3. Replace these placeholders:"
echo "   • REACT_APP_FIREBASE_API_KEY"
echo "   • REACT_APP_FIREBASE_AUTH_DOMAIN"
echo "   • REACT_APP_FIREBASE_PROJECT_ID"
echo "   • REACT_APP_FIREBASE_STORAGE_BUCKET"
echo "   • REACT_APP_FIREBASE_MESSAGING_SENDER_ID"
echo "   • REACT_APP_FIREBASE_APP_ID"
echo ""
echo "4. Save the file and restart your development server:"
echo -e "   ${YELLOW}npm start${NC}"
echo ""
echo "5. Verify Firebase connection in browser console"
echo ""

# Quick edit option
read -p "Do you want to edit .env file now? (y/N): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v nano &> /dev/null; then
        nano .env
    elif command -v vim &> /dev/null; then
        vim .env
    else
        echo -e "${YELLOW}⚠️  No text editor found. Please edit .env manually.${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   🔒 Security Reminder                         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${RED}⚠️  NEVER commit .env file to Git!${NC}"
echo "   The .env file is already in .gitignore"
echo ""
echo -e "${BLUE}ℹ️  For production deployment, use environment variables${NC}"
echo "   provided by your hosting platform (Vercel, Netlify, etc.)"
echo ""

