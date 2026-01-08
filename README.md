# Retrospeck 🦉

See your sprints more clearly with Retrospeck - your wise owl companion for agile retrospectives. A beautiful, real-time collaboration space where teams reflect, discover insights, and continuously improve together.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![Firebase](https://img.shields.io/badge/Firebase-12-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

## Features

- 🚀 **Real-time collaboration** - Watch ideas flow in real-time as your team shares feedback
- 🎭 **Anonymous feedback** - Let team members share honest thoughts without judgment
- ❤️ **Vote & prioritize** - Upvote important items to focus on what matters
- 📋 **Ready-made templates** - Start fast with Mad/Sad/Glad, Start/Stop/Continue, and more
- 🔒 **Secure authentication** - Sign in with email or Google
- 🎨 **Beautiful UI** - Dark mode design with smooth animations
- 🖱️ **Drag and drop** - Easily reorganize cards between lists

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database & Auth**: Firebase (Firestore + Authentication)
- **State Management**: Zustand
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **Drag & Drop**: dnd-kit
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Firebase project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/retroverse.git
   cd retroverse
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Firebase project at [firebase.google.com](https://firebase.google.com)

4. Enable **Authentication** (Email/Password and Google providers) and **Firestore Database**

5. Create a `.env.local` file with your Firebase config:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
   ```

6. Set up Firestore indexes (create these in Firebase Console):
   - Collection: `boards`, Fields: `members` (Array), `updatedAt` (Descending)
   - Collection: `lists`, Fields: `boardId` (Ascending), `order` (Ascending)
   - Collection: `cards`, Fields: `boardId` (Ascending), `createdAt` (Descending)

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── (app)/             # Protected routes (dashboard, board)
│   ├── (auth)/            # Auth routes (login, signup)
│   └── join/              # Board join page
├── components/
│   ├── auth/              # Authentication components
│   ├── board/             # Board header and settings
│   ├── cards/             # Retro card component
│   ├── lists/             # Retro list component
│   └── ui/                # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and Firebase config
├── stores/                # Zustand state management
└── types/                 # TypeScript type definitions
```

## Templates

Retroverse comes with built-in retrospective templates:

- **Mad, Sad, Glad** - Classic emotional retrospective format
- **Start, Stop, Continue** - Action-oriented retrospective
- **Went Well, To Improve, Action Items** - Results-focused format
- **Custom** - Create your own lists

## License

MIT
