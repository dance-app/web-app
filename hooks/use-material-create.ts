import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { MaterialVisibility } from '@/types/material';

interface CreateMaterialData {
  name: string;
  description: string;
  visibility: MaterialVisibility;
  sharedWithWorkspaces?: string[];
  sharedWithUsers?: string[];
}

export function useMaterialCreate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMaterialData) => {
      const response = await fetch(
        `/api/workspace/${workspace?.id}/materials`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create material');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', workspace?.id] });
    },
  });
}
