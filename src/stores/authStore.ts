import { create } from 'zustand';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  authUnsubscribe: (() => void) | null;
  
  // Actions
  initialize: () => () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  firebaseUser: null,
  isLoading: false,
  isInitialized: false,
  error: null,
  authUnsubscribe: null,

  initialize: () => {
    // Prevent multiple auth listeners
    const { authUnsubscribe: existing } = get();
    if (existing) {
      console.warn('[Auth] Listener already exists, skipping initialization');
      return existing;
    }

    console.log('[Auth] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged fired:', firebaseUser ? 'User logged in' : 'No user');
      
      if (firebaseUser) {
        console.log('[Auth] User ID:', firebaseUser.uid);
        try {
          // Fetch or create user document
          console.log('[Auth] Fetching user document...');
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          console.log('[Auth] User document exists:', userDoc.exists());
          
          if (userDoc.exists()) {
            console.log('[Auth] Setting existing user in state');
            set({ 
              user: userDoc.data() as User, 
              firebaseUser,
              isInitialized: true,
              isLoading: false 
            });
          } else {
            // Create user document if it doesn't exist
            console.log('[Auth] User document not found, creating new one...');
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || 'Anonymous',
              ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
              createdAt: Date.now(),
            };
            
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
              console.log('[Auth] User document created successfully');
            } catch (firestoreError) {
              console.error('[Auth] FAILED to create user document:', firestoreError);
              // Continue anyway - user can still use the app
            }
            
            console.log('[Auth] Setting new user in state');
            set({ 
              user: newUser, 
              firebaseUser,
              isInitialized: true,
              isLoading: false 
            });
          }
        } catch (error) {
          console.error('[Auth] ERROR in auth state change:', error);
          // Still set the user from Firebase Auth data even if Firestore fails
          const fallbackUser: User = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'Anonymous',
            ...(firebaseUser.photoURL ? { photoURL: firebaseUser.photoURL } : {}),
            createdAt: Date.now(),
          };
          set({ 
            user: fallbackUser, 
            firebaseUser,
            isInitialized: true,
            isLoading: false 
          });
        }
      } else {
        console.log('[Auth] No user - setting null state');
        set({ 
          user: null, 
          firebaseUser: null,
          isInitialized: true,
          isLoading: false 
        });
      }
    });
    console.log('[Auth] Auth listener set up complete');

    set({ authUnsubscribe: unsubscribe });
    return () => {
      unsubscribe();
      set({ authUnsubscribe: null });
    };
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign in';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signUp: async (email: string, password: string, displayName: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(firebaseUser, { displayName });
      
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName,
        createdAt: Date.now(),
      };
      
      try {
        await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      } catch (firestoreError) {
        console.error('Failed to create user document:', firestoreError);
        // Continue anyway - the onAuthStateChanged will handle it
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign up';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signInWithGoogle: async () => {
    set({ isLoading: true, error: null });
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // Note: isLoading will be set to false by onAuthStateChanged
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign in with Google';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await firebaseSignOut(auth);
      set({ user: null, firebaseUser: null, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to sign out';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
