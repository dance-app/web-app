import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useEventDelete() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/workspace/${workspace?.slug}/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', workspace?.slug] });
    },
  });
}
