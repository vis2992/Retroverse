import { create } from 'zustand';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot,
  writeBatch,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateJoinCode } from '@/lib/utils';
import type { Board, List, Card, BoardTemplate } from '@/types';
import { nanoid } from 'nanoid';

interface BoardState {
  // Data
  boards: Board[];
  currentBoard: Board | null;
  lists: List[];
  cards: Card[];
  
  // Loading states
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Subscriptions cleanup
  unsubscribeBoard: (() => void) | null;
  unsubscribeLists: (() => void) | null;
  unsubscribeCards: (() => void) | null;
  
  // Board actions
  fetchUserBoards: (userId: string) => Promise<void>;
  createBoard: (name: string, template: BoardTemplate, ownerId: string, backgroundColor: string) => Promise<string>;
  joinBoard: (code: string, userId: string) => Promise<string | null>;
  subscribeToBoard: (boardId: string) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => Promise<void>;
  deleteBoard: (boardId: string) => Promise<void>;
  leaveBoard: (boardId: string, userId: string) => Promise<void>;
  
  // List actions
  createList: (boardId: string, title: string, emoji: string, color: string) => Promise<void>;
  updateList: (listId: string, updates: Partial<List>) => Promise<void>;
  deleteList: (listId: string) => Promise<void>;
  reorderLists: (lists: List[]) => Promise<void>;
  
  // Card actions
  createCard: (listId: string, boardId: string, content: string, authorId: string, authorName: string, isAnonymous: boolean, emoji?: string, gifUrl?: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<Card>) => Promise<void>;
  deleteCard: (cardId: string) => Promise<void>;
  moveCard: (cardId: string, newListId: string, newOrder?: number) => Promise<void>;
  reorderCards: (listId: string, cards: Card[]) => Promise<void>;
  voteCard: (cardId: string, userId: string) => Promise<void>;
  unvoteCard: (cardId: string, userId: string) => Promise<void>;
  
  // Cleanup
  cleanup: () => void;
  clearError: () => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [],
  currentBoard: null,
  lists: [],
  cards: [],
  isLoading: false,
  isSaving: false,
  error: null,
  unsubscribeBoard: null,
  unsubscribeLists: null,
  unsubscribeCards: null,

  fetchUserBoards: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      // Simple query without orderBy to avoid index requirement
      const q = query(
        collection(db, 'boards'),
        where('members', 'array-contains', userId)
      );
      const snapshot = await getDocs(q);
      const boards = snapshot.docs
        .map(doc => ({ ...doc.data(), id: doc.id } as Board))
        .sort((a, b) => b.updatedAt - a.updatedAt); // Sort on client side
      set({ boards, isLoading: false });
    } catch (error: unknown) {
      console.error('Failed to fetch boards:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch boards';
      set({ error: message, isLoading: false, boards: [] });
    }
  },

  createBoard: async (name: string, template: BoardTemplate, ownerId: string, backgroundColor: string) => {
    set({ isSaving: true, error: null });
    try {
      const boardId = nanoid();
      const now = Date.now();
      
      const board: Board = {
        id: boardId,
        name,
        createdAt: now,
        updatedAt: now,
        ownerId,
        members: [ownerId],
        joinCode: generateJoinCode(),
        isPublic: false,
        template,
        backgroundColor,
      };
      
      console.log('Creating board:', board);
      await setDoc(doc(db, 'boards', boardId), board);
      console.log('Board created successfully');
      
      // Create default lists based on template
      if (template !== 'custom') {
        const { BOARD_TEMPLATES } = await import('@/types');
        const templateConfig = BOARD_TEMPLATES[template];
        
        if (templateConfig && templateConfig.lists.length > 0) {
          const batch = writeBatch(db);
          
          templateConfig.lists.forEach((listConfig, index) => {
            const listId = nanoid();
            const list: List = {
              id: listId,
              boardId,
              title: listConfig.title,
              emoji: listConfig.emoji,
              color: listConfig.color,
              order: index,
              createdAt: now,
            };
            batch.set(doc(db, 'lists', listId), list);
          });
          
          console.log('Creating lists for template:', template);
          await batch.commit();
          console.log('Lists created successfully');
        }
      }
      
      set({ isSaving: false });
      return boardId;
    } catch (error: unknown) {
      console.error('Failed to create board:', error);
      const message = error instanceof Error ? error.message : 'Failed to create board';
      set({ error: message, isSaving: false });
      throw error;
    }
  },

  joinBoard: async (code: string, userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const q = query(collection(db, 'boards'), where('joinCode', '==', code.toUpperCase()));
      const snapshot = await getDocs(q);
      
      if (snapshot.empty) {
        set({ error: 'Board not found with that code', isLoading: false });
        return null;
      }
      
      const boardDoc = snapshot.docs[0];
      const boardData = boardDoc.data() as Board;
      
      if (!boardData.members.includes(userId)) {
        await updateDoc(doc(db, 'boards', boardDoc.id), {
          members: arrayUnion(userId),
          updatedAt: Date.now(),
        });
      }
      
      set({ isLoading: false });
      return boardDoc.id;
    } catch (error: unknown) {
      console.error('Failed to join board:', error);
      const message = error instanceof Error ? error.message : 'Failed to join board';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  subscribeToBoard: (boardId: string) => {
    const { unsubscribeBoard, unsubscribeLists, unsubscribeCards } = get();
    
    // Cleanup existing subscriptions
    unsubscribeBoard?.();
    unsubscribeLists?.();
    unsubscribeCards?.();
    
    set({ isLoading: true, error: null });
    
    // Subscribe to board
    const boardUnsub = onSnapshot(
      doc(db, 'boards', boardId), 
      (doc) => {
        if (doc.exists()) {
          set({ currentBoard: { ...doc.data(), id: doc.id } as Board });
        } else {
          set({ error: 'Board not found', isLoading: false });
        }
      },
      (error) => {
        console.error('Board subscription error:', error);
        set({ error: error.message, isLoading: false });
      }
    );
    
    // Subscribe to lists (simple query, sort on client)
    const listsQuery = query(
      collection(db, 'lists'),
      where('boardId', '==', boardId)
    );
    const listsUnsub = onSnapshot(
      listsQuery, 
      (snapshot) => {
        const lists = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as List))
          .sort((a, b) => a.order - b.order);
        set({ lists });
      },
      (error) => {
        console.error('Lists subscription error:', error);
      }
    );
    
    // Subscribe to cards (simple query, sort on client by order first, then by createdAt)
    const cardsQuery = query(
      collection(db, 'cards'),
      where('boardId', '==', boardId)
    );
    const cardsUnsub = onSnapshot(
      cardsQuery, 
      (snapshot) => {
        const cards = snapshot.docs
          .map(doc => ({ ...doc.data(), id: doc.id } as Card))
          .sort((a, b) => {
            // Sort by order if it exists, otherwise by createdAt
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order;
            }
            return b.createdAt - a.createdAt;
          });
        set({ cards, isLoading: false });
      },
      (error) => {
        console.error('Cards subscription error:', error);
        set({ isLoading: false });
      }
    );
    
    set({
      unsubscribeBoard: boardUnsub,
      unsubscribeLists: listsUnsub,
      unsubscribeCards: cardsUnsub,
    });
  },

  updateBoard: async (boardId: string, updates: Partial<Board>) => {
    set({ isSaving: true, error: null });
    try {
      await updateDoc(doc(db, 'boards', boardId), {
        ...updates,
        updatedAt: Date.now(),
      });
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to update board:', error);
      const message = error instanceof Error ? error.message : 'Failed to update board';
      set({ error: message, isSaving: false });
    }
  },

  deleteBoard: async (boardId: string) => {
    set({ isSaving: true, error: null });
    try {
      // Delete all cards
      const cardsQuery = query(collection(db, 'cards'), where('boardId', '==', boardId));
      const cardsSnapshot = await getDocs(cardsQuery);
      const batch = writeBatch(db);
      cardsSnapshot.docs.forEach(d => batch.delete(d.ref));
      
      // Delete all lists
      const listsQuery = query(collection(db, 'lists'), where('boardId', '==', boardId));
      const listsSnapshot = await getDocs(listsQuery);
      listsSnapshot.docs.forEach(d => batch.delete(d.ref));
      
      // Delete the board
      batch.delete(doc(db, 'boards', boardId));
      
      await batch.commit();
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to delete board:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete board';
      set({ error: message, isSaving: false });
    }
  },

  leaveBoard: async (boardId: string, userId: string) => {
    set({ isSaving: true, error: null });
    try {
      await updateDoc(doc(db, 'boards', boardId), {
        members: arrayRemove(userId),
        updatedAt: Date.now(),
      });
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to leave board:', error);
      const message = error instanceof Error ? error.message : 'Failed to leave board';
      set({ error: message, isSaving: false });
    }
  },

  createList: async (boardId: string, title: string, emoji: string, color: string) => {
    set({ isSaving: true, error: null });
    try {
      const { lists } = get();
      const listId = nanoid();
      const list: List = {
        id: listId,
        boardId,
        title,
        emoji,
        color,
        order: lists.length,
        createdAt: Date.now(),
      };
      await setDoc(doc(db, 'lists', listId), list);
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to create list:', error);
      const message = error instanceof Error ? error.message : 'Failed to create list';
      set({ error: message, isSaving: false });
    }
  },

  updateList: async (listId: string, updates: Partial<List>) => {
    set({ isSaving: true, error: null });
    try {
      await updateDoc(doc(db, 'lists', listId), updates);
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to update list:', error);
      const message = error instanceof Error ? error.message : 'Failed to update list';
      set({ error: message, isSaving: false });
    }
  },

  deleteList: async (listId: string) => {
    set({ isSaving: true, error: null });
    try {
      // Delete all cards in this list
      const cardsQuery = query(collection(db, 'cards'), where('listId', '==', listId));
      const cardsSnapshot = await getDocs(cardsQuery);
      const batch = writeBatch(db);
      cardsSnapshot.docs.forEach(d => batch.delete(d.ref));
      batch.delete(doc(db, 'lists', listId));
      await batch.commit();
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to delete list:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete list';
      set({ error: message, isSaving: false });
    }
  },

  reorderLists: async (lists: List[]) => {
    set({ isSaving: true, error: null });
    try {
      const batch = writeBatch(db);
      lists.forEach((list, index) => {
        batch.update(doc(db, 'lists', list.id), { order: index });
      });
      await batch.commit();
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to reorder lists:', error);
      const message = error instanceof Error ? error.message : 'Failed to reorder lists';
      set({ error: message, isSaving: false });
    }
  },

  createCard: async (listId: string, boardId: string, content: string, authorId: string, authorName: string, isAnonymous: boolean, emoji?: string, gifUrl?: string) => {
    set({ isSaving: true, error: null });
    try {
      const { cards } = get();
      const listCards = cards.filter(c => c.listId === listId);
      const maxOrder = listCards.length > 0 ? Math.max(...listCards.map(c => c.order || 0)) : -1;
      
      const cardId = nanoid();
      const now = Date.now();
      const card: Card = {
        id: cardId,
        listId,
        boardId,
        content,
        authorId,
        authorName: isAnonymous ? 'Anonymous' : authorName,
        votes: [],
        createdAt: now,
        updatedAt: now,
        isAnonymous,
        order: maxOrder + 1,
        emoji: emoji || undefined,
        gifUrl: gifUrl || undefined,
      };
      await setDoc(doc(db, 'cards', cardId), card);
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to create card:', error);
      const message = error instanceof Error ? error.message : 'Failed to create card';
      set({ error: message, isSaving: false });
    }
  },

  updateCard: async (cardId: string, updates: Partial<Card>) => {
    set({ isSaving: true, error: null });
    try {
      await updateDoc(doc(db, 'cards', cardId), {
        ...updates,
        updatedAt: Date.now(),
      });
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to update card:', error);
      const message = error instanceof Error ? error.message : 'Failed to update card';
      set({ error: message, isSaving: false });
    }
  },

  deleteCard: async (cardId: string) => {
    set({ isSaving: true, error: null });
    try {
      await deleteDoc(doc(db, 'cards', cardId));
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to delete card:', error);
      const message = error instanceof Error ? error.message : 'Failed to delete card';
      set({ error: message, isSaving: false });
    }
  },

  moveCard: async (cardId: string, newListId: string, newOrder?: number) => {
    set({ isSaving: true, error: null });
    try {
      const updates: Partial<Card> = {
        listId: newListId,
        updatedAt: Date.now(),
      };
      
      if (newOrder !== undefined) {
        updates.order = newOrder;
      }
      
      await updateDoc(doc(db, 'cards', cardId), updates);
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to move card:', error);
      const message = error instanceof Error ? error.message : 'Failed to move card';
      set({ error: message, isSaving: false });
    }
  },

  reorderCards: async (listId: string, cards: Card[]) => {
    set({ isSaving: true, error: null });
    try {
      const batch = writeBatch(db);
      cards.forEach((card, index) => {
        batch.update(doc(db, 'cards', card.id), { order: index });
      });
      await batch.commit();
      set({ isSaving: false });
    } catch (error: unknown) {
      console.error('Failed to reorder cards:', error);
      const message = error instanceof Error ? error.message : 'Failed to reorder cards';
      set({ error: message, isSaving: false });
    }
  },

  voteCard: async (cardId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'cards', cardId), {
        votes: arrayUnion(userId),
      });
    } catch (error: unknown) {
      console.error('Failed to vote:', error);
      const message = error instanceof Error ? error.message : 'Failed to vote';
      set({ error: message });
    }
  },

  unvoteCard: async (cardId: string, userId: string) => {
    try {
      await updateDoc(doc(db, 'cards', cardId), {
        votes: arrayRemove(userId),
      });
    } catch (error: unknown) {
      console.error('Failed to remove vote:', error);
      const message = error instanceof Error ? error.message : 'Failed to remove vote';
      set({ error: message });
    }
  },

  cleanup: () => {
    const { unsubscribeBoard, unsubscribeLists, unsubscribeCards } = get();
    unsubscribeBoard?.();
    unsubscribeLists?.();
    unsubscribeCards?.();
    set({
      currentBoard: null,
      lists: [],
      cards: [],
      unsubscribeBoard: null,
      unsubscribeLists: null,
      unsubscribeCards: null,
    });
  },

  clearError: () => set({ error: null }),
}));
