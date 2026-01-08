'use client';

import { useEffect, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { motion } from 'framer-motion';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const { user, isInitialized, isLoading } = useAuthStore();

  useEffect(() => {
    if (isInitialized && !user && !isLoading) {
      router.push('/login');
    }
  }, [user, isInitialized, isLoading, router]);

  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <img src="/images/retrospeck-logo.png" alt="Retrospeck" className="w-16 h-16 animate-pulse" />
          <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}

