'use client';

import { AuthGuard } from '@/components/auth';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}

