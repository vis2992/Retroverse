'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Copy, Check, Settings, Trash2, LogOut } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBoardStore } from '@/stores/boardStore';
import { Button, Modal, Input } from '@/components/ui';
import { BOARD_COLORS } from '@/types';

export function BoardHeader() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentBoard, updateBoard, deleteBoard, leaveBoard } = useBoardStore();
  
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editName, setEditName] = useState(currentBoard?.name || '');
  const [editColor, setEditColor] = useState(currentBoard?.backgroundColor || BOARD_COLORS[0]);

  if (!currentBoard) return null;

  const isOwner = user?.id === currentBoard.ownerId;

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(currentBoard.joinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSettings = async () => {
    await updateBoard(currentBoard.id, { name: editName, backgroundColor: editColor });
    setShowSettings(false);
  };

  const handleDeleteBoard = async () => {
    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      await deleteBoard(currentBoard.id);
      router.push('/dashboard');
    }
  };

  const handleLeaveBoard = async () => {
    if (confirm('Are you sure you want to leave this board?')) {
      await leaveBoard(currentBoard.id, user!.id);
      router.push('/dashboard');
    }
  };

  return (
    <header className="bg-zinc-950/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-white">{currentBoard.name}</h1>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/10 text-xs text-zinc-300">
              <Users className="w-3.5 h-3.5" />
              {currentBoard.members.length}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Join Code */}
          <motion.button
            onClick={handleCopyCode}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 text-zinc-300 hover:bg-white/20 transition-colors text-sm font-mono"
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1 text-green-400"
                >
                  <Check className="w-4 h-4" />
                  Copied!
                </motion.div>
              ) : (
                <motion.div
                  key="code"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  {currentBoard.joinCode}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditName(currentBoard.name);
              setEditColor(currentBoard.backgroundColor);
              setShowSettings(true);
            }}
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={showSettings} onClose={() => setShowSettings(false)} title="Board Settings">
        <div className="space-y-6">
          <Input
            label="Board Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Board Color</label>
            <div className="flex gap-2 flex-wrap">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setEditColor(color)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    editColor === color ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowSettings(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSaveSettings} className="flex-1">
              Save Changes
            </Button>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            {!isOwner && (
              <Button variant="secondary" className="w-full" onClick={handleLeaveBoard}>
                <LogOut className="w-4 h-4" />
                Leave Board
              </Button>
            )}
            {isOwner && (
              <Button variant="danger" className="w-full" onClick={handleDeleteBoard}>
                <Trash2 className="w-4 h-4" />
                Delete Board
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </header>
  );
}

