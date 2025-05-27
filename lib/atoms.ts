import { atomWithStorage } from 'jotai/utils';
import type { AuthState, User } from '@/types';

export const authAtom = atomWithStorage<AuthState>('auth-state', {
  status: 'loading',
  token: null,
  refreshToken: null,
});

export const authUserAtom = atomWithStorage<{ user: User | null }>(
  'auth-user',
  {
    user: null,
  }
);
