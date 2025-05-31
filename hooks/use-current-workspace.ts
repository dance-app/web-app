'use client';

import { useMemo } from 'react';
import { useWorkspaces } from './use-workspaces';
import { useCurrentWorkspaceSlug } from './use-current-workspace-slug';

export function useCurrentWorkspace() {
  const { workspaces, isLoading, isFetching } = useWorkspaces();
  const slug = useCurrentWorkspaceSlug();

  const workspace = useMemo(() => {
    if (!slug) return null;
    return workspaces.find((w) => w.slug === slug) ?? null;
  }, [workspaces, slug]);

  return {
    workspace,
    isLoading: isLoading || isFetching,
  };
}
