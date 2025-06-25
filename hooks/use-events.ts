import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useEvents() {
  const { workspace } = useCurrentWorkspace();

  const { data, ...query } = useQuery({
    queryKey: ['events', workspace?.slug],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.slug}/events`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    events: data?.events || [],
    danceTypes: data?.danceTypes || [],
    ...query,
  };
}
