# Authentication Setup Guide

## Required Environment Variables

Create a `.env.local` file in your project root and add the following variables:

```env
# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-client-email
FIREBASE_PRIVATE_KEY=your-private-key
```

## Generating NEXTAUTH_SECRET

You can generate a secure secret using the following command:
```bash
openssl rand -base64 32
```

## Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Copy the values from the downloaded JSON file to your `.env.local`

## Google OAuth Setup (Optional)

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Go to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID credentials
5. Add `http://localhost:3000/api/auth/callback/google` to the authorized redirect URIs
