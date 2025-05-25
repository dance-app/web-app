import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';

type SignInArgs = Parameters<typeof api.auth.signIn>[0];

export function useSignIn({
  onSuccess,
}: { onSuccess?: (user: User) => void } = {}) {
  const mutation = useMutation({
    mutationFn: async (params: SignInArgs) => {
      const response = await api.auth.signIn(params);
      return response.user;
    },
    onSuccess,
    onError: (error: unknown) => {
      console.error('Login failed', error);
    },
  });

  return {
    signIn: mutation.mutate,
    ...mutation,
  };
}
