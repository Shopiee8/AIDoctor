// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAoIqQ3uX7FtcyJWiin4Ui-zVcxdIdCk08",
  authDomain: "vizion-ai-f9834.firebaseapp.com",
  projectId: "vizion-ai-f9834",
  storageBucket: "vizion-ai-f9834.appspot.com",
  messagingSenderId: "434583939793",
  appId: "1:434583939793:web:bd0f5623e0d07d4b27b3f0",
  measurementId: "G-N16CQ6JHE1"
};

const app = initializeApp(firebaseConfig);

let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
