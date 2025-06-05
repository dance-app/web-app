import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { workspacesAtom } from '@/lib/atoms';
import { Workspace } from '@/types';

export function useWorkspaces() {
  const [workspacesState, setWorkspacesState] = useAtom(workspacesAtom);
  
  const { data, isLoading, isError, error, ...query } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () =>
      fetch('/api/workspace', { method: 'GET', credentials: 'include' }).then(
        (r) => r.json()
      ),
  });

  // Sync query data with atom
  useEffect(() => {
    const workspaces = (data?.workspaces?.data as Workspace[]) || ([] as Workspace[]);
    setWorkspacesState({
      workspaces,
      isLoading,
      error: isError ? error : null,
    });
  }, [data, isLoading, isError, error, setWorkspacesState]);

  return {
    workspaces: workspacesState.workspaces,
    meta: data?.workspaces?.meta || {},
    isLoading,
    isError,
    error,
    ...query,
  };
}
