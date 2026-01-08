import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAc1shYFpiU56ZiWXISxs77oQ5T-r_2Kkk",
  authDomain: "retroverse-d0e1e.firebaseapp.com",
  projectId: "retroverse-d0e1e",
  storageBucket: "retroverse-d0e1e.firebasestorage.app",
  messagingSenderId: "114374922298",
  appId: "1:114374922298:web:1955a9f1d6c3dc53c92503"
};

console.log('[Firebase] Initializing with project:', firebaseConfig.projectId);

// Initialize Firebase only if it hasn't been initialized
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

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

