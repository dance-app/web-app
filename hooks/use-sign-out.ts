'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      await signOut({ callbackUrl: '/auth/sign-in' });
    },
    onSuccess: async () => {
      // Clear all queries
      queryClient.clear();
      router.push('/auth/sign-in');
    },
  });

  return {
    signOut: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
