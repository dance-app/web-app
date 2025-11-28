import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { AuthState, User, Workspace } from '@/types';
import type { Session } from 'next-auth';

// NextAuth session atom
export const sessionAtom = atom<Session | null>(null);

// Placeholder user atom (session no longer carries user data)
export const authUserAtom = atom<{ user: User | null }>({ user: null });

// Legacy auth atom for compatibility (can be removed later)
export const authAtom = atomWithStorage<AuthState>('auth-state', {
  status: 'loading',
  token: null,
  refreshToken: null,
});

// Workspace state atoms
export const currentWorkspaceSlugAtom = atom<string | null>(null);

// Workspaces data atom (from API)
export const workspacesAtom = atom<{
  workspaces: Workspace[];
  isLoading: boolean;
  error?: any;
}>({
  workspaces: [],
  isLoading: true,
  error: null,
});

// Derived atom for current workspace from workspaces list
// export const currentWorkspaceAtom = atom<Workspace | null>((get) => {
//   const slug = get(currentWorkspaceSlugAtom);
//   const workspacesData = get(workspacesAtom);

//   if (!slug || !workspacesData?.workspaces) return null;

//   return (
//     workspacesData.workspaces.find((w: Workspace) => w.slug === slug) || null
//   );
// });

// Workspace preference atom with user-specific storage
export const workspacePreferenceAtom = atomWithStorage<{
  [userId: string]: string; // userId -> preferredWorkspaceSlug
}>('workspace-preferences', {});
