'use client';

import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();

  // Handle token refresh errors by signing out
  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      signOut({ callbackUrl: '/auth/sign-in' });
    }
  }, [session?.error]);

  return {
    user: session?.user || null,
    isLoading: status === 'loading',
    accessToken: session?.accessToken,
    error: session?.error,
  };
}
