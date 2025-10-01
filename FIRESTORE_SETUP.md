# Firestore Security Rules Setup

## Issue
The app is getting permission errors because Firestore security rules are not configured. This prevents users from creating and accessing their data.

## Solution
Deploy the Firestore security rules to your Firebase project.

## Steps to Fix

### Option 1: Using Firebase CLI (Recommended)

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   cd /home/vishwas/Desktop/todoApp/React-Js-Todo-App-with-firebase-auth
   firebase init firestore
   ```
   - Select your existing project: `mytodoapp2025`
   - Use the existing `firestore.rules` file
   - Use the existing `firestore.indexes.json` file

4. **Deploy the rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Option 2: Using the provided script

1. **Make the script executable** (already done):
   ```bash
   chmod +x deploy-firestore-rules.sh
   ```

2. **Run the deployment script**:
   ```bash
   ./deploy-firestore-rules.sh
   ```

### Option 3: Manual deployment via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `mytodoapp2025`
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read and write their own todos
    match /todos/{todoId} {
      allow read, write: if request.auth != null && 
        (resource == null || resource.data.userId == request.auth.uid);
    }
    
    // Users can read and write their own stats
    match /stats/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Click **Publish**

## What the rules do

- **Users collection**: Users can only read/write their own user document
- **Todos collection**: Users can only read/write todos that belong to them
- **Stats collection**: Users can only read/write their own stats

## After deployment

Once the rules are deployed, your app will work properly:
- Users can sign up without permission errors
- User documents will be created in Firestore
- Todos will be saved and retrieved correctly
- All data will be properly secured

## Testing

After deploying the rules:
1. Try signing up with a new account
2. Check the browser console - you should see "User document created successfully"
3. The app should work without permission errors

## Troubleshooting

If you still get permission errors:
1. Make sure you're logged in to the correct Firebase project
2. Check that the rules were deployed successfully
3. Try refreshing the page and signing up again
4. Check the Firebase Console to see if the rules are active
