'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useSignOut() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/auth/sign-out', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || 'Failed to sign out');
      }

      return res.json();
    },
    onSuccess: () => {
      // ✅ Clear all cached queries
      queryClient.clear();

      // ✅ Optionally clear client state like atoms if still used
      // setAuth(null); setAuthUser(null); etc.

      // ✅ Redirect to login
      router.replace('/auth/sign-in');
    },
    onError: (err) => {
      console.error('Sign-out error:', err);
    },
  });

  return {
    signOut: mutation.mutate,
    ...mutation,
  };
}
