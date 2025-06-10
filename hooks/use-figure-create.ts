import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { FigureVisibility, FigureMetadata } from '@/types';

interface CreateFigureData {
  name: string;
  description: string;
  metadata?: FigureMetadata;
  visibility: FigureVisibility;
  sharedWithWorkspaces?: string[];
  sharedWithUsers?: string[];
}

export function useFigureCreate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateFigureData) => {
      const response = await fetch(`/api/workspace/${workspace?.id}/figures`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create figure');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['figures', workspace?.id] });
    },
  });
}