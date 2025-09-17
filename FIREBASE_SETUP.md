# Firebase Setup Instructions

## Current Issue: Firebase Connection Problems

### Most Likely Causes:
1. **Firebase Security Rules** - Default rules deny all read/write access
2. **Network/CORS Issues** - Browser blocking Firebase requests
3. **Incorrect Configuration** - Wrong database URL or project settings

### Steps to Fix:

#### 1. Check Firebase Console
Go to [Firebase Console](https://console.firebase.google.com/project/mitsride)

#### 2. Configure Realtime Database Rules
1. Go to "Realtime Database" section
2. Click on "Rules" tab
3. Current rules probably look like:
```json
{
  "rules": {
    ".read": false,
    ".write": false
  }
}
```

4. **For development/testing**, temporarily change to:
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

⚠️ **Warning**: These rules allow anyone to read/write your database. Use only for development!

#### 3. Production Rules (Use Later)
```json
{
  "rules": {
    "drivers": {
      ".read": true,
      ".write": true
    },
    "buses": {
      ".read": true,
      ".write": true
    },
    "test": {
      ".read": true,
      ".write": true
    }
  }
}
```

#### 4. Check Database URL
Ensure the database URL in firebase.js matches your Firebase project:
- Current: `https://mitsride-default-rtdb.firebaseio.com/`
- Should match the URL shown in Firebase Console

### Testing Steps:
1. Update Firebase rules as described above
2. Refresh the Firebase test page
3. Click "Test Basic Connection" first
4. Then click "Test Database Access"
5. Check browser console for detailed error messages

### Common Error Codes:
- `PERMISSION_DENIED` = Security rules blocking access
- `NETWORK_ERROR` = Internet/firewall issues
- `INVALID_ARGUMENT` = Wrong database URL or configuration
