'use client';

import { useQuery } from '@tanstack/react-query';
import { useSession, signOut } from 'next-auth/react';
import { apiCall } from '@/lib/api/client';
import type { User } from '@/types';
import { ERROR_MESSAGES } from '@/lib/api/shared.api';

export function useCurrentUser() {
  const { data: session, status } = useSession();
  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined;

  const query = useQuery<User | null>({
    queryKey: ['currentUser', accessToken],
    enabled: status === 'authenticated' && !!accessToken,
    queryFn: async () => {
      if (!accessToken) throw new Error('No access token');
      try {
        const response = await apiCall<User | null>('/auth/me', {
          credentials: 'omit',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return response.data ?? null;
      } catch (error) {
        const code = (error as any)?.code as string | undefined;
        const friendly =
          (code && ERROR_MESSAGES[code]) ||
          (error as Error).message ||
          'Unable to fetch user';
        if (code === 'invalid-token' || code === 'invalid-refresh-token') {
          signOut({ callbackUrl: '/auth/sign-in' });
        }
        throw new Error(friendly);
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    user: query.data || null,
    isLoading: status === 'loading' || query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
