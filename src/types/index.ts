// Board Types
export interface Board {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
  members: string[];
  joinCode: string;
  isPublic: boolean;
  template: BoardTemplate;
  backgroundColor: string;
}

export type BoardTemplate = 'mad-sad-glad' | 'start-stop-continue' | 'went-well-improve-action' | 'custom';

export interface List {
  id: string;
  boardId: string;
  title: string;
  emoji: string;
  color: string;
  order: number;
  createdAt: number;
}

export interface Card {
  id: string;
  listId: string;
  boardId: string;
  content: string;
  authorId: string;
  authorName: string;
  votes: string[]; // Array of user IDs who voted
  createdAt: number;
  updatedAt: number;
  isAnonymous: boolean;
  order: number;
  gifUrl?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: number;
}

// Template Configurations
export const BOARD_TEMPLATES: Record<BoardTemplate, { name: string; lists: { title: string; emoji: string; color: string }[] }> = {
  'mad-sad-glad': {
    name: 'Mad, Sad, Glad',
    lists: [
      { title: 'Mad', emoji: '😠', color: '#ef4444' },
      { title: 'Sad', emoji: '😢', color: '#3b82f6' },
      { title: 'Glad', emoji: '😊', color: '#22c55e' },
    ],
  },
  'start-stop-continue': {
    name: 'Start, Stop, Continue',
    lists: [
      { title: 'Start', emoji: '🚀', color: '#22c55e' },
      { title: 'Stop', emoji: '🛑', color: '#ef4444' },
      { title: 'Continue', emoji: '➡️', color: '#3b82f6' },
    ],
  },
  'went-well-improve-action': {
    name: 'Went Well, To Improve, Action Items',
    lists: [
      { title: 'Went Well', emoji: '✅', color: '#22c55e' },
      { title: 'To Improve', emoji: '📈', color: '#f59e0b' },
      { title: 'Action Items', emoji: '📋', color: '#8b5cf6' },
    ],
  },
  'custom': {
    name: 'Custom',
    lists: [],
  },
};

export const BOARD_COLORS = [
  '#1e1b4b', // Deep indigo
  '#172554', // Deep blue
  '#042f2e', // Deep teal
  '#14532d', // Deep green
  '#422006', // Deep amber
  '#450a0a', // Deep red
  '#2e1065', // Deep purple
  '#0c0a09', // Deep stone
];

