import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Event } from '@/types';
import { useCurrentWorkspace } from './use-current-workspace';

export function useEventUpdate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Event>) =>
      fetch(`/api/workspace/${workspace?.slug}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', workspace?.slug] });
    },
  });
}
