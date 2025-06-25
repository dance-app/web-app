import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useMembers() {
  const { workspace } = useCurrentWorkspace();
  const { data, ...query } = useQuery({
    queryKey: ['members', workspace?.slug],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.slug}/members`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    members: data?.members || [],
    ...query,
  };
}
