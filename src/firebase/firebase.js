// src/firebase/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Replace these values with your actual Firebase project settings.
// You can get them from the Firebase Console (Project Settings > General > Your Apps).
export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Check if keys have been replaced
export const isFirebaseConfigured = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "YOUR_API_KEY" && 
  firebaseConfig.apiKey.trim() !== "";

let app;
let auth;
let db;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    console.log("Firebase initialized successfully with cloud configuration.");
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
} else {
  console.log("Firebase is not configured yet. Running in Local Sandboxed Demo Mode.");
}

export { auth, db };
