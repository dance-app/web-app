import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { Figure } from '@/types';

interface MarketplaceFilters {
  search?: string;
  difficulty?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export function useMarketplaceFigures(filters: MarketplaceFilters = {}) {
  const { data, ...query } = useQuery({
    queryKey: ['marketplace-figures', filters],
    queryFn: () => {
      const params = new URLSearchParams();
      
      if (filters.search) params.append('search', filters.search);
      if (filters.difficulty) params.append('difficulty', filters.difficulty.toString());
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      return fetch(`/api/marketplace/figures?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json());
    },
  });

  return {
    figures: data?.figures || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    ...query,
  };
}

export function useFigureCopy() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (figureId: string) => {
      const response = await fetch('/api/marketplace/figures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          figureId, 
          workspaceId: workspace?.id 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy figure');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['figures', workspace?.id] });
    },
  });
}