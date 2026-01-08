import { initializeApp, getApps } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAFV5UtCnpdIEmAayja8Q_cWUDBIDfa8X4",
  authDomain: "retrospeck-5b3af.firebaseapp.com",
  projectId: "retrospeck-5b3af",
  storageBucket: "retrospeck-5b3af.firebasestorage.app",
  messagingSenderId: "471459019706",
  appId: "1:471459019706:web:a9298a5f60583842ec7b83"
};

console.log('[Firebase] Initializing with project:', firebaseConfig.projectId);

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Set auth persistence to local (survives browser restarts)
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.warn('[Firebase] Failed to set auth persistence:', error);
  });
}

// Try to enable offline persistence (helps with connection issues)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('[Firebase] Persistence failed - multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('[Firebase] Persistence not available in this browser');
    }
  });
}

console.log('[Firebase] Initialization complete');

export { app, auth, db };

