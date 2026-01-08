'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialize = useAuthStore((state) => state.initialize);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization (React Strict Mode protection)
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    const unsubscribe = initialize();
    return () => {
      unsubscribe();
      isInitializedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  return <>{children}</>;
}

