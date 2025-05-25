import { atomWithStorage } from 'jotai/utils';
import type { AuthState } from '@/types';

export const authAtom = atomWithStorage<AuthState>('auth', {
  status: 'loading',
  user: null,
});
