'use client';

import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/lib/api/client';
import { ERROR_MESSAGES } from '@/lib/api/shared.api';

export function useSignUp({
  onError,
  onSuccess,
}: {
  onError: (error: Error) => void;
  onSuccess: (data: { user: User }) => void;
}) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const data = await apiCall<{ user: User }>('/auth/sign-up', {
        method: 'POST',
        body: { firstName, lastName, email, password },
        credentials: 'omit', // avoid CORS preflight issues while backend cookies are not consumed here
      });
      return data;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
      onSuccess(data);
    },
    onError: (error: Error) => {
      const code = (error as any)?.code as string | undefined;
      const friendly =
        (code && ERROR_MESSAGES[code]) || error.message || 'Sign-up failed';
      onError(new Error(friendly));
    },
  });

  return {
    signUp: mutation.mutate,
    ...mutation,
  };
}
