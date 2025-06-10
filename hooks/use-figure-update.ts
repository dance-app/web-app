import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { FigureVisibility, FigureMetadata } from '@/types';

interface UpdateFigureData {
  figureId: string;
  name?: string;
  description?: string;
  metadata?: FigureMetadata;
  visibility?: FigureVisibility;
  sharedWithWorkspaces?: string[];
  sharedWithUsers?: string[];
}

export function useFigureUpdate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateFigureData) => {
      const response = await fetch(`/api/workspace/${workspace?.id}/figures`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update figure');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['figures', workspace?.id] });
    },
  });
}