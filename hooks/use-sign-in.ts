import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ERROR_MESSAGES } from '@/lib/api/shared.api';

export function useSignIn() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const mutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        const friendly =
          ERROR_MESSAGES[result.error] || result.error || 'Sign-in failed';
        throw new Error(friendly);
      }

      return result;
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      const target = result?.url || callbackUrl || '/';
      router.replace(target);
    },
  });

  return {
    signIn: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
  };
}
