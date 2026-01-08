'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBoardStore } from '@/stores/boardStore';
import { RetroCard } from '@/components/cards/RetroCard';
import { Button, Textarea, Input, Modal, EmojiPicker } from '@/components/ui';
import type { List, Card } from '@/types';
import { cn } from '@/lib/utils';

interface RetroListProps {
  list: List;
  cards: Card[];
  boardId: string;
}

export function RetroList({ list, cards, boardId }: RetroListProps) {
  const { user } = useAuthStore();
  const { createCard, updateList, deleteList } = useBoardStore();
  
  const [showAddCard, setShowAddCard] = useState(false);
  const [newCardContent, setNewCardContent] = useState('');
  const [newCardGif, setNewCardGif] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(list.title);
  const [editEmoji, setEditEmoji] = useState(list.emoji);

  const { setNodeRef, isOver } = useDroppable({ id: list.id });

  const handleAddCard = async () => {
    if (!newCardContent.trim() || !user) return;
    setIsAdding(true);
    try {
      await createCard(
        list.id, 
        boardId, 
        newCardContent.trim(), 
        user.id, 
        user.displayName, 
        isAnonymous,
        newCardGif || undefined
      );
      setNewCardContent('');
      setNewCardGif('');
      setShowAddCard(false);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateList = async () => {
    await updateList(list.id, { title: editTitle, emoji: editEmoji });
    setShowEditModal(false);
  };

  const handleDeleteList = async () => {
    if (confirm(`Delete "${list.title}" and all its cards?`)) {
      await deleteList(list.id);
    }
    setShowMenu(false);
  };

  const cardIds = cards.map((c) => c.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex-shrink-0 w-80 bg-zinc-900/50 backdrop-blur-sm rounded-2xl border border-white/10 transition-all duration-200',
        isOver && 'ring-2 ring-violet-500/50'
      )}
    >
      {/* List Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{list.emoji}</span>
            <h3 className="font-semibold text-white">{list.title}</h3>
            <span className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-zinc-400">
              {cards.length}
            </span>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-0 top-8 w-40 bg-zinc-800 border border-white/10 rounded-xl shadow-xl z-20 overflow-hidden"
              >
                <button
                  onClick={() => { setShowEditModal(true); setShowMenu(false); }}
                  className="w-full px-4 py-2.5 text-left text-sm text-zinc-300 hover:bg-white/10 flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit list
                </button>
                <button
                  onClick={handleDeleteList}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 border-t border-white/10"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete list
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Color bar */}
        <div className="h-1 rounded-full mt-3" style={{ backgroundColor: list.color }} />
      </div>

      {/* Cards */}
      <div className="p-3 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          <AnimatePresence>
            {cards.map((card) => (
              <RetroCard key={card.id} card={card} listColor={list.color} />
            ))}
          </AnimatePresence>
        </SortableContext>

        {/* Add Card Form */}
        <AnimatePresence>
          {showAddCard ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-zinc-800/80 rounded-xl border border-white/10 p-4 space-y-3"
            >
              <Textarea
                placeholder="What's on your mind?"
                value={newCardContent}
                onChange={(e) => setNewCardContent(e.target.value)}
                className="min-h-[80px]"
                autoFocus
              />
              
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-zinc-500" />
                <Input
                  placeholder="GIF URL (optional)"
                  value={newCardGif}
                  onChange={(e) => setNewCardGif(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm text-zinc-400">Post anonymously</span>
              </label>

              <div className="flex gap-2">
                <Button size="sm" onClick={handleAddCard} isLoading={isAdding} className="flex-1">
                  Add Card
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { 
                  setShowAddCard(false); 
                  setNewCardContent(''); 
                  setNewCardGif('');
                }}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setShowAddCard(true)}
              className="w-full p-3 rounded-xl border border-dashed border-white/10 text-zinc-500 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add a card
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Edit List Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit List">
        <div className="space-y-6">
          <Input
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />
          <EmojiPicker
            label="Emoji"
            value={editEmoji}
            onChange={setEditEmoji}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowEditModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleUpdateList} className="flex-1">
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

