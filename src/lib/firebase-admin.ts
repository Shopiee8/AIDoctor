import { initializeApp, getApps, cert, type ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// Service account key from environment variables
const serviceAccount = {
  type: process.env.FIREBASE_ADMIN_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
} as ServiceAccount;

import type { App } from 'firebase-admin/app';

// Initialize Firebase Admin
let adminApp: App;

try {
  if (getApps().length === 0) {
    adminApp = initializeApp({
      credential: cert(serviceAccount as ServiceAccount),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
    console.log('Firebase Admin initialized successfully');
  } else {
    adminApp = getApps()[0];
  }
} catch (error) {
  console.error('Firebase admin initialization error', error);
  throw new Error('Failed to initialize Firebase Admin');
}

if (!adminApp) {
  throw new Error('Failed to get Firebase Admin instance');
}

// Initialize Firestore
const adminDb = getFirestore(adminApp);

// Initialize Auth
const adminAuth = getAuth(adminApp);

// Initialize Storage
const adminStorage = getStorage(adminApp);

export { adminDb, adminAuth, adminStorage };

export default adminApp;
