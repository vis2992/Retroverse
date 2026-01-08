import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBP9IEtFsyxOmaFblJhN6J2Wyz54AN54PA",
  authDomain: "retroverse-fe901.firebaseapp.com",
  projectId: "retroverse-fe901",
  storageBucket: "retroverse-fe901.firebasestorage.app",
  messagingSenderId: "417140441534",
  appId: "1:417140441534:web:c111d1e855f478794479ef"
};

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };

