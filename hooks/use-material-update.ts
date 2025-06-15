import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { MaterialVisibility, MaterialMetadata } from '@/types';

interface UpdateMaterialData {
  materialId: string;
  name?: string;
  description?: string;
  metadata?: MaterialMetadata;
  visibility?: MaterialVisibility;
  sharedWithWorkspaces?: string[];
  sharedWithUsers?: string[];
}

export function useMaterialUpdate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMaterialData) => {
      const response = await fetch(
        `/api/workspace/${workspace?.id}/materials`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update material');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', workspace?.id] });
    },
  });
}
