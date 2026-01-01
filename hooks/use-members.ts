import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import { useSession } from 'next-auth/react';
import { BASE_URL } from '@/lib/api/shared.api';
import { Member } from '@/types';

export function useMembers() {
  const { workspace } = useCurrentWorkspace();
  const { data: session, status } = useSession();
  const accessToken = session?.accessToken as string | undefined;

  const { data, isLoading, isError, error, ...query } = useQuery<{
    data: Member[];
  }>({
    queryKey: ['members', workspace?.slug],
    queryFn: async () => {
      if (!accessToken || !workspace) throw new Error('No access token or workspace');

      const res = await fetch(`${BASE_URL}/workspaces/${workspace.slug}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch members');
      return res.json();
    },
    enabled: !!workspace && status === 'authenticated' && !!accessToken,
  });

  return {
    members: data?.data || [],
    isLoading,
    isError,
    error,
    ...query,
  };
}
