import { useAtom } from 'jotai';
import { authAtom } from '@/lib/atoms';
import { useEffect } from 'react';
import { api } from '@/lib/api';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);

  useEffect(() => {
    if (auth.status !== 'loading') return;

    // Simulate fetching current user — replace with real check
    api.auth
      .getCurrentUser?.()
      .then((user) => {
        if (!user) {
          setAuth({ status: 'unauthenticated', user: null });
        } else {
          setAuth({ status: 'authenticated', user });
        }
      })
      .catch(() => {
        setAuth({ status: 'unauthenticated', user: null });
      });
  }, [auth, setAuth]);

  return {
    isLoading: auth.status === 'loading',
    isAuthenticated: auth.status === 'authenticated',
    user: auth.user,
    signOut: () => setAuth({ status: 'unauthenticated', user: null }),
  };
}
