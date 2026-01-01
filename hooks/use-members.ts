import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import { useSession } from 'next-auth/react';
import { apiCall } from '@/lib/api/client';
import { Member } from '@/types';
import type { ApiSuccess } from '@/lib/api/shared.api';

type MembersMeta = {
  totalCount: number;
  count: number;
  page: number;
  pages: number;
  limit: number;
  offset: number;
};

export function useMembers() {
  const { workspace } = useCurrentWorkspace();
  const { data: session, status } = useSession();
  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined;

  const { data, isLoading, isError, error, ...query } = useQuery<
    ApiSuccess<Member[], MembersMeta>
  >({
    queryKey: ['members', workspace?.slug],
    queryFn: async () => {
      if (!accessToken || !workspace)
        throw new Error('No access token or workspace');

      return apiCall<Member[], MembersMeta>(
        `/workspaces/${workspace.slug}/members`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    },
    enabled: !!workspace && status === 'authenticated' && !!accessToken,
  });

  return {
    members: data?.data || [],
    meta: data?.meta,
    isLoading,
    isError,
    error,
    ...query,
  };
}
