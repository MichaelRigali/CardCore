# CardCore Firebase Deployment Guide

## 🔐 Deploy Security Rules

### Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Storage Rules
```bash
firebase deploy --only storage
```

## 🧪 Testing the Setup

1. **Login to CardCore** (ensure you have a user with uid)
2. **Navigate to** `/dev/card-test`
3. **Fill in the form**:
   - Name: Charizard
   - Set: Base Set
   - Value: 187.00
   - Upload an image file
4. **Click "Run Helper Test"**
5. **Verify success** in the log output

## ✅ Expected Results

### Firestore
- New document at `users/{uid}/cards/{cardId}`
- Contains: name, set, rarity, condition, valueEstimate, imageUrl, createdAt
- `imageUrl` should be populated with Firebase Storage URL

### Storage
- New file at `cards/{uid}/{cardId}.jpg`
- Accessible via the URL stored in Firestore

### Security
- Only authenticated users can create cards
- Users can only access their own cards
- Storage allows public read, authenticated write

## 🗑️ Clean Up

After testing, you can delete the dev test page:
```bash
rm -rf src/app/dev/
```

## 🔍 Troubleshooting

- **Permission denied**: Check if rules are deployed
- **Storage error**: Verify storage bucket is configured
- **Firestore error**: Check if Firestore is enabled in Firebase Console
