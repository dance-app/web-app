import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import { useSession } from 'next-auth/react';
import { useDebounce } from './use-debounce';
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

type MembersPage = ApiSuccess<Member[], MembersMeta>;

export interface UseMembersParams {
  roles?: string;
  limit?: number;
}

const DEFAULT_LIMIT = 20;

export function useMembers(params: UseMembersParams = {}) {
  const { workspace } = useCurrentWorkspace();
  const { data: session, status } = useSession();
  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined;

  const [searchValue, setSearchValue] = useState('');
  const debouncedSearch = useDebounce(searchValue, 300);

  const limit = params.limit ?? DEFAULT_LIMIT;

  const onSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    ...query
  } = useInfiniteQuery<MembersPage>({
    queryKey: ['members', workspace?.slug, { search: debouncedSearch, roles: params.roles, limit }],
    queryFn: async ({ pageParam }) => {
      if (!accessToken || !workspace)
        throw new Error('No access token or workspace');

      const offset = pageParam as number;
      const searchParams = new URLSearchParams();
      if (debouncedSearch) searchParams.set('search', debouncedSearch);
      if (params.roles) searchParams.set('roles', params.roles);
      searchParams.set('limit', String(limit));
      searchParams.set('offset', String(offset));

      const qs = searchParams.toString();
      const endpoint = `/workspaces/${workspace.slug}/members?${qs}`;

      return apiCall<Member[], MembersMeta>(endpoint, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (!lastPage.meta) return undefined;
      const { offset, limit, totalCount } = lastPage.meta;
      const nextOffset = offset + limit;
      return nextOffset < totalCount ? nextOffset : undefined;
    },
    enabled: !!workspace && status === 'authenticated' && !!accessToken,
  });

  const members = Array.from(
    new Map(
      (data?.pages.flatMap((page) => page.data) ?? []).map((m) => [m.id, m])
    ).values()
  );
  const meta = data?.pages[data.pages.length - 1]?.meta;

  return {
    members,
    meta,
    isLoading,
    isError,
    error,
    searchValue,
    onSearchChange,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    ...query,
  };
}
