'use client';

// import { useEffect } from 'react';
// import { useAtom } from 'jotai';
// import { useRouter } from 'next/navigation';
// import { workspacePreferenceAtom } from '@/lib/atoms';
// import { useAuth } from './use-auth';
import { useWorkspaces } from './use-workspaces';
import { useCurrentWorkspaceSlug } from './use-current-workspace-slug';

export function useCurrentWorkspace() {
  const { workspaces, isLoading } = useWorkspaces();
  const { slug } = useCurrentWorkspaceSlug();
  // const [preferences, setPreferences] = useAtom(workspacePreferenceAtom);
  // const { user } = useAuth();
  // const router = useRouter();

  // Function to set workspace preference
  // const setWorkspacePreference = (workspaceSlug: string) => {
  //   if (!user?.id) return;

  //   setPreferences((prev) => ({
  //     ...prev,
  //     [user.id]: workspaceSlug,
  //   }));
  // };

  // Function to get preferred workspace
  // const getPreferredWorkspace = () => {
  //   if (!user?.id || !workspaces.length) return null;

  //   const preferredSlug = preferences[user.id];
  //   return preferredSlug
  //     ? workspaces.find((w) => w.slug === preferredSlug) || workspaces[0]
  //     : workspaces[0];
  // };

  // const switchWorkspace = (workspaceSlug: string) => {
  //   setWorkspacePreference(workspaceSlug);
  //   router.push(`/w/${workspaceSlug}`);
  // };

  // useEffect(() => {
  //   if (slug && user?.id) {
  //     setPreferences((prev) => ({
  //       ...prev,
  //       [user.id]: slug,
  //     }));
  //   }
  // }, [slug, user?.id, setPreferences]);

  const currentWorkspace = workspaces.find((ws) => ws.slug === slug);

  return {
    workspace: currentWorkspace,
    isLoading,
    // switchWorkspace,
    // getPreferredWorkspace,
    // setWorkspacePreference,
  };
}
