'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
  MeasuringStrategy,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Plus, Sparkles } from 'lucide-react';
import { useBoardStore } from '@/stores/boardStore';
import { BoardHeader } from '@/components/board';
import { RetroList } from '@/components/lists';
import { RetroCard } from '@/components/cards';
import { Button, Modal, Input, EmojiPicker } from '@/components/ui';
import type { Card } from '@/types';

export default function BoardPage() {
  const params = useParams();
  const boardId = params.id as string;
  
  const {
    currentBoard,
    lists,
    cards,
    isLoading,
    subscribeToBoard,
    cleanup,
    createList,
    moveCard,
    reorderCards,
  } = useBoardStore();
  
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [showAddList, setShowAddList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListEmoji, setNewListEmoji] = useState('📝');

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    subscribeToBoard(boardId);
    return () => cleanup();
  }, [boardId, subscribeToBoard, cleanup]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const card = cards.find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeCard = cards.find((c) => c.id === activeId);
    const overCard = cards.find((c) => c.id === overId);

    if (!activeCard) return;

    // If hovering over a different list's droppable area
    const overList = lists.find((l) => l.id === overId);
    if (overList && activeCard.listId !== overList.id) {
      // Visual feedback handled by CSS
      return;
    }

    // If hovering over a card in the same or different list
    if (overCard && activeCard.id !== overCard.id) {
      // Visual feedback handled by dnd-kit's sortable context
      return;
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);

    if (!over || active.id === over.id) return;

    const activeCard = cards.find((c) => c.id === active.id);
    if (!activeCard) return;

    // Check if dropped on a list (droppable container)
    const targetList = lists.find((l) => l.id === over.id);
    if (targetList) {
      if (activeCard.listId !== targetList.id) {
        // Moving to a different list
        await moveCard(activeCard.id, targetList.id);
      }
      return;
    }

    // Check if dropped on another card
    const overCard = cards.find((c) => c.id === over.id);
    if (overCard) {
      if (activeCard.listId === overCard.listId) {
        // Reordering within the same list
        const listCards = cards
          .filter((c) => c.listId === activeCard.listId)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const oldIndex = listCards.findIndex((c) => c.id === active.id);
        const newIndex = listCards.findIndex((c) => c.id === over.id);
        
        if (oldIndex !== newIndex) {
          // Reorder the array
          const reorderedCards = [...listCards];
          const [movedCard] = reorderedCards.splice(oldIndex, 1);
          reorderedCards.splice(newIndex, 0, movedCard);
          
          // Update with new orders
          await reorderCards(activeCard.listId, reorderedCards);
        }
      } else {
        // Moving to a different list
        const targetListCards = cards
          .filter((c) => c.listId === overCard.listId)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        
        const newIndex = targetListCards.findIndex((c) => c.id === over.id);
        await moveCard(activeCard.id, overCard.listId, newIndex);
        
        // Reorder the target list cards
        const updatedCards = [...targetListCards];
        updatedCards.splice(newIndex, 0, activeCard);
        await reorderCards(overCard.listId, updatedCards);
      }
    }
  };

  const handleAddList = async () => {
    if (!newListTitle.trim()) return;
    const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];
    const randomColor = colors[lists.length % colors.length];
    await createList(boardId, newListTitle.trim(), newListEmoji, randomColor);
    setNewListTitle('');
    setNewListEmoji('📝');
    setShowAddList(false);
  };

  if (isLoading || !currentBoard) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-zinc-400 text-sm">Loading board...</p>
        </motion.div>
      </div>
    );
  }

  const sortedLists = [...lists].sort((a, b) => a.order - b.order);

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{ backgroundColor: currentBoard.backgroundColor }}
    >
      <BoardHeader />

      <main className="p-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
        >
          <div className="flex gap-6 overflow-x-auto pb-6">
            {/* Lists */}
            {sortedLists.map((list) => (
              <RetroList
                key={list.id}
                list={list}
                cards={cards.filter((c) => c.listId === list.id)}
                boardId={boardId}
              />
            ))}

            {/* Add List Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setShowAddList(true)}
              className="flex-shrink-0 w-80 h-fit p-6 rounded-2xl border-2 border-dashed border-white/20 bg-white/5 backdrop-blur-sm hover:border-white/40 hover:bg-white/10 transition-all flex flex-col items-center justify-center gap-3 text-white/60 hover:text-white"
            >
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                <Plus className="w-6 h-6" />
              </div>
              <span className="font-medium">Add another list</span>
            </motion.button>
          </div>

          <DragOverlay>
            {activeCard && (
              <div className="w-72 opacity-90">
                <RetroCard
                  card={activeCard}
                  listColor={lists.find((l) => l.id === activeCard.listId)?.color || '#8b5cf6'}
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>

        {/* Empty State */}
        {lists.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10 text-violet-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start your retrospective</h2>
            <p className="text-white/60 mb-6 text-center max-w-md">
              Add your first list to begin collecting feedback from your team
            </p>
            <Button onClick={() => setShowAddList(true)}>
              <Plus className="w-4 h-4" />
              Add Your First List
            </Button>
          </motion.div>
        )}
      </main>

      {/* Add List Modal */}
      <Modal isOpen={showAddList} onClose={() => setShowAddList(false)} title="Add New List">
        <div className="space-y-6">
          <Input
            label="List Title"
            placeholder="e.g., What went well?"
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
          />
          
          <EmojiPicker
            label="Emoji"
            value={newListEmoji}
            onChange={setNewListEmoji}
          />

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAddList(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleAddList} className="flex-1">
              Add List
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

