import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event } from '@/types';
import { useCurrentWorkspace } from './use-current-workspace';

export function useEventCreate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Event>) =>
      fetch(`/api/workspace/${workspace?.id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', workspace?.id] });
    },
  });
}
