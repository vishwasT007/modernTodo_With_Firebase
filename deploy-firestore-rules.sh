#!/bin/bash

# Deploy Firestore security rules to Firebase
echo "Deploying Firestore security rules..."

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    echo "Then run: firebase login"
    exit 1
fi

# Deploy the rules
firebase deploy --only firestore:rules

echo "Firestore rules deployed successfully!"
echo "Your app should now work with proper permissions."
