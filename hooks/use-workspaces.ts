import { useQuery } from '@tanstack/react-query';
import { useAuth } from './use-auth';
import { Workspace } from '@/types';
import { BASE_URL } from '@/lib/api/shared.api';

export function useWorkspaces({ enabled }: { enabled?: boolean } = {}) {
  const { accessToken, user } = useAuth();

  const { data, isLoading, isError, error, ...query } = useQuery<{
    meta: {
      count: number;
      limit: number;
      offset: number;
      totalCount: number;
    };
    data: Workspace[];
  }>({
    queryKey: ['workspaces'],
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token');

      const res = await fetch(`${BASE_URL}/workspaces`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch workspaces');
      return res.json();
    },
    enabled: enabled !== false && !!user && !!accessToken,
  });

  return {
    workspaces: data?.data || [],
    meta: data?.meta || {},
    isLoading,
    isError,
    error,
    ...query,
  };
}
