'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LogOut, Sparkles, Users, Clock, MoreVertical, Trash2, ExternalLink, Link2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBoardStore } from '@/stores/boardStore';
import { Button, Input, Modal } from '@/components/ui';
import { BOARD_TEMPLATES, BOARD_COLORS, type BoardTemplate } from '@/types';
import { formatRelativeTime } from '@/lib/utils';

export default function DashboardPage() {
  const router = useRouter();
  const { user, signOut } = useAuthStore();
  const { boards, isLoading, error, fetchUserBoards, createBoard, joinBoard, deleteBoard, clearError, cleanup } = useBoardStore();
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newBoardName, setNewBoardName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BoardTemplate>('mad-sad-glad');
  const [selectedColor, setSelectedColor] = useState(BOARD_COLORS[0]);
  const [joinCode, setJoinCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserBoards(user.id);
    }
    // Cleanup any board subscriptions when returning to dashboard
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleCreateBoard = async () => {
    if (!newBoardName.trim() || !user) return;
    setIsCreating(true);
    setLocalError(null);
    try {
      const boardId = await createBoard(newBoardName.trim(), selectedTemplate, user.id, selectedColor);
      setShowCreateModal(false);
      setNewBoardName('');
      router.push(`/board/${boardId}`);
    } catch (err) {
      console.error('Create board error:', err);
      setLocalError(err instanceof Error ? err.message : 'Failed to create board');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinBoard = async () => {
    if (!joinCode.trim() || !user) return;
    const boardId = await joinBoard(joinCode.trim(), user.id);
    if (boardId) {
      setShowJoinModal(false);
      setJoinCode('');
      router.push(`/board/${boardId}`);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      await deleteBoard(boardId);
      fetchUserBoards(user!.id);
    }
    setMenuOpenId(null);
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-white/10 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-amber-500 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🦉</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Retrospeck</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-medium text-sm">
                {user?.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-zinc-300 text-sm hidden sm:block">{user?.displayName}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4" />
            Create Board
          </Button>
          <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
            <Link2 className="w-4 h-4" />
            Join with Code
          </Button>
        </div>

        {/* Boards Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Boards</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-zinc-900 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : boards.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zinc-900/50 border border-white/10 rounded-2xl p-12 text-center"
            >
              <div className="w-16 h-16 bg-violet-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-5xl">🦉</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Let's get started!</h3>
              <p className="text-zinc-400 mb-6">Retrospeck is ready to help. Create your first board or join an existing one</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setShowCreateModal(true)}>
                  <Plus className="w-4 h-4" />
                  Create Board
                </Button>
                <Button variant="secondary" onClick={() => setShowJoinModal(true)}>
                  Join Board
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {boards.map((board, index) => (
                  <motion.div
                    key={board.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div
                      onClick={() => router.push(`/board/${board.id}`)}
                      className="h-40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/10 border border-white/10"
                      style={{ backgroundColor: board.backgroundColor }}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{board.name}</h3>
                          <p className="text-sm text-white/60 mt-1">
                            {BOARD_TEMPLATES[board.template]?.name || 'Custom'}
                          </p>
                        </div>
                        
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuOpenId(menuOpenId === board.id ? null : board.id);
                            }}
                            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>
                          
                          {menuOpenId === board.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute right-0 top-8 w-48 bg-zinc-800 border border-white/10 rounded-xl shadow-xl z-10 overflow-hidden"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(board.joinCode);
                                  setMenuOpenId(null);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/10 flex items-center gap-2"
                              >
                                <Link2 className="w-4 h-4" />
                                Copy join code
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  router.push(`/board/${board.id}`);
                                }}
                                className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-white/10 flex items-center gap-2"
                              >
                                <ExternalLink className="w-4 h-4" />
                                Open board
                              </button>
                              {board.ownerId === user?.id && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteBoard(board.id);
                                  }}
                                  className="w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete board
                                </button>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>{board.members.length}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatRelativeTime(board.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      {/* Create Board Modal */}
      <Modal isOpen={showCreateModal} onClose={() => { setShowCreateModal(false); setLocalError(null); }} title="Create New Board">
        <div className="space-y-6">
          {(localError || error) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {localError || error}
            </motion.div>
          )}
          
          <Input
            label="Board Name"
            placeholder="Sprint 42 Retrospective"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
          />

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Template</label>
            <div className="grid grid-cols-1 gap-2">
              {(Object.entries(BOARD_TEMPLATES) as [BoardTemplate, typeof BOARD_TEMPLATES[BoardTemplate]][]).filter(([key]) => key !== 'custom').map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selectedTemplate === key
                      ? 'border-violet-500 bg-violet-500/10'
                      : 'border-white/10 hover:border-white/20 bg-white/5'
                  }`}
                >
                  <div className="font-medium text-white mb-1">{template.name}</div>
                  <div className="text-sm text-zinc-400 flex gap-2">
                    {template.lists.map((list) => (
                      <span key={list.title}>{list.emoji} {list.title}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-3">Board Color</label>
            <div className="flex gap-2 flex-wrap">
              {BOARD_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-xl transition-all ${
                    selectedColor === color ? 'ring-2 ring-violet-500 ring-offset-2 ring-offset-zinc-900' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleCreateBoard} isLoading={isCreating} className="flex-1">
              Create Board
            </Button>
          </div>
        </div>
      </Modal>

      {/* Join Board Modal */}
      <Modal isOpen={showJoinModal} onClose={() => { setShowJoinModal(false); clearError(); }} title="Join Board">
        <div className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}
          
          <Input
            label="Join Code"
            placeholder="Enter 8-character code"
            value={joinCode}
            onChange={(e) => { setJoinCode(e.target.value.toUpperCase()); clearError(); }}
            maxLength={8}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setShowJoinModal(false); clearError(); }} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleJoinBoard} isLoading={isLoading} className="flex-1">
              Join Board
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

