import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useMaterialDelete() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const response = await fetch(
        `/api/workspace/${workspace?.id}/materials?materialId=${materialId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete material');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', workspace?.id] });
    },
  });
}
