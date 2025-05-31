import { Workspace } from '@/types';
import { useQuery } from '@tanstack/react-query';

export function useWorkspaces() {
  const { data, ...query } = useQuery({
    queryKey: ['workspaces'],
    queryFn: () =>
      fetch('/api/workspace', { method: 'GET', credentials: 'include' }).then(
        (r) => r.json()
      ),
  });

  return {
    workspaces: (data?.workspaces?.data as Workspace[]) || ([] as Workspace[]),
    meta: data?.workspaces?.meta || {},
    ...query,
  };
}
