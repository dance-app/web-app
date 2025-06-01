'use client';

import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function useSignUp() {
  const queryClient = useQueryClient();
  const router = useRouter();

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
      const response = await fetch('/api/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const responseJSON = await response.json();
      if (responseJSON.error) throw new Error(responseJSON.error);
      return responseJSON;
    },
    onSuccess: async (data: { user: User }) => {
      await queryClient.invalidateQueries({ queryKey: ['authUser'] });
      router.push('/');
    },
    onError: (error: Error) => {
      console.error('Sign-up error:', error);
    },
  });

  return {
    signUp: mutation.mutate,
    ...mutation,
  };
}
