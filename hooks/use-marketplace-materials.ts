import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

interface MarketplaceFilters {
  search?: string;
  difficulty?: number;
  tags?: string[];
  limit?: number;
  offset?: number;
}

export function useMarketplaceMaterials(filters: MarketplaceFilters = {}) {
  const { data, ...query } = useQuery({
    queryKey: ['marketplace-materials', filters],
    queryFn: async () => {
      const params = new URLSearchParams();

      if (filters.search) params.append('search', filters.search);
      if (filters.difficulty)
        params.append('difficulty', filters.difficulty.toString());
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      return fetch(`/api/marketplace/materials?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json());
    },
  });

  return {
    materials: data?.materials || [],
    total: data?.total || 0,
    hasMore: data?.hasMore || false,
    ...query,
  };
}

export function useMaterialCopy() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (materialId: string) => {
      const response = await fetch('/api/marketplace/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          materialId,
          workspaceId: workspace?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to copy material');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials', workspace?.id] });
    },
  });
}
