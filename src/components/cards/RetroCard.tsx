'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Heart, Trash2, GripVertical, Edit2, Check, X } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useBoardStore } from '@/stores/boardStore';
import type { Card } from '@/types';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui';

interface RetroCardProps {
  card: Card;
  listColor: string;
}

export function RetroCard({ card, listColor }: RetroCardProps) {
  const { user } = useAuthStore();
  const { voteCard, unvoteCard, updateCard, deleteCard } = useBoardStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(card.content);
  
  const hasVoted = user ? card.votes.includes(user.id) : false;
  const isOwner = user?.id === card.authorId;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleVote = () => {
    if (!user) return;
    if (hasVoted) {
      unvoteCard(card.id, user.id);
    } else {
      voteCard(card.id, user.id);
    }
  };

  const handleSaveEdit = async () => {
    if (editContent.trim() && editContent !== card.content) {
      await updateCard(card.id, { content: editContent.trim() });
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(card.content);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Delete this card?')) {
      await deleteCard(card.id);
    }
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      initial={{ opacity: 0, y: 10 }}
      animate={{ 
        opacity: isDragging ? 0.5 : 1, 
        y: 0,
        scale: isDragging ? 1.02 : 1,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      layout
      className={cn(
        'group relative bg-zinc-800/80 backdrop-blur-sm rounded-xl border border-white/10 p-4 pl-5 overflow-hidden',
        'transition-all duration-200',
        isDragging && 'z-50 rotate-2 shadow-2xl shadow-violet-500/30 ring-2 ring-violet-500/50'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 p-1 -m-1 text-zinc-600 hover:text-zinc-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4" />
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[80px]"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 rounded-lg bg-zinc-700 text-zinc-400 hover:bg-zinc-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-zinc-200 text-sm whitespace-pre-wrap break-words">{card.content}</p>
              
              {card.gifUrl && (
                <div className="mt-3 rounded-lg overflow-hidden">
                  <img 
                    src={card.gifUrl} 
                    alt="GIF" 
                    className="w-full h-auto max-h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                <div className="flex items-center gap-3">
                  {/* Vote button */}
                  <button
                    onClick={handleVote}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium transition-all',
                      hasVoted
                        ? 'bg-pink-500/20 text-pink-400'
                        : 'bg-white/5 text-zinc-500 hover:text-pink-400 hover:bg-pink-500/10'
                    )}
                  >
                    <Heart className={cn('w-4 h-4', hasVoted && 'fill-current')} />
                    <span>{card.votes.length}</span>
                  </button>

                  {/* Author */}
                  <span className="text-xs text-zinc-500">
                    {card.isAnonymous ? 'Anonymous' : card.authorName}
                  </span>
                </div>

                {/* Actions */}
                {isOwner && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={handleDelete}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Color accent */}
      <div
        className="absolute top-0 left-0 w-1 h-full rounded-l-xl"
        style={{ backgroundColor: listColor }}
      />
    </motion.div>
  );
}

