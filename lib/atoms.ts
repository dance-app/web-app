import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { AuthState, User, Workspace } from '@/types';

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
export const currentWorkspaceAtom = atom<Workspace | null>((get) => {
  const slug = get(currentWorkspaceSlugAtom);
  const workspacesData = get(workspacesAtom);

  if (!slug || !workspacesData?.workspaces) return null;

  return (
    workspacesData.workspaces.find((w: Workspace) => w.slug === slug) || null
  );
});

// Workspace preference atom with user-specific storage
export const workspacePreferenceAtom = atomWithStorage<{
  [userId: string]: string; // userId -> preferredWorkspaceSlug
}>('workspace-preferences', {});
