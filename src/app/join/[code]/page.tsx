'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBoardStore } from '@/stores/boardStore';

export default function JoinPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;
  
  const { user, isInitialized } = useAuthStore();
  const { joinBoard, error } = useBoardStore();
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    const attemptJoin = async () => {
      if (!isInitialized) return;
      
      if (!user) {
        // Redirect to login with return URL
        router.push(`/login?redirect=/join/${code}`);
        return;
      }

      setJoining(true);
      const boardId = await joinBoard(code, user.id);
      if (boardId) {
        router.push(`/board/${boardId}`);
      } else {
        setJoining(false);
      }
    };

    attemptJoin();
  }, [code, user, isInitialized, joinBoard, router]);

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-xl font-semibold text-white mb-2">Board not found</h1>
          <p className="text-zinc-400 mb-6">
            The board with code &quot;{code}&quot; doesn&apos;t exist or has been deleted.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-medium transition-colors"
          >
            Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <img src="/images/retrospeck-logo.svg" alt="Retrospeck" className="w-20 h-20" />
        <div className="text-center">
          <h1 className="text-xl font-semibold text-white mb-2">Joining board...</h1>
          <p className="text-zinc-400">Code: {code}</p>
        </div>
        <div className="w-8 h-8 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </motion.div>
    </div>
  );
}

