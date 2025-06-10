import { useQuery } from '@tanstack/react-query';
import type { Event, DanceType } from '@/types';
import { useCurrentWorkspace } from './use-current-workspace';

export function useEvents() {
  const { workspace } = useCurrentWorkspace();
  
  const { data, ...query } = useQuery({
    queryKey: ['events', workspace?.id],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.id}/events`, {
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
