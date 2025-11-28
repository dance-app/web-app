import { useQuery } from '@tanstack/react-query';
import { Workspace } from '@/types';
import { BASE_URL } from '@/lib/api/shared.api';
import { MockApi, logMockDataUsage, shouldUseMockData } from '@/lib/mock-api';
import { useSession } from 'next-auth/react';

export function useWorkspaces({ enabled }: { enabled?: boolean } = {}) {
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;

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
      // Check if we should use mock data
      const mockResponse = await MockApi.getWorkspaces();
      if (mockResponse) {
        logMockDataUsage('GET /workspaces (useWorkspaces)');
        return mockResponse;
      }

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
    enabled:
      enabled !== false &&
      (shouldUseMockData() || (status === 'authenticated' && !!accessToken)),
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
