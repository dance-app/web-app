import { useAtom } from 'jotai';
import { authAtom, authUserAtom } from '@/lib/atoms';

export function useAuth() {
  const [auth, setAuth] = useAtom(authAtom);
  const [authUser, setAuthUser] = useAtom(authUserAtom);

  return {
    isLoading: auth.status === 'loading',
    isAuthenticated: auth.status === 'authenticated',
    user: authUser.user,
    signOut: () => {
      setAuth({ status: 'unauthenticated', token: null, refreshToken: null });
      setAuthUser({ user: null });
    },
  };
}
