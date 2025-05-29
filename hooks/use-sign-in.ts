import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { useRouter } from 'next/navigation';

export function useSignIn() {
  const queryClient = useQueryClient();
  // const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      fetch('/api/auth/sign-in', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) throw new Error(data.error);
          return data;
        }),
    onSuccess: (data: { user: User }) => {
      queryClient.setQueryData(['authUser'], data.user);
      window.location.reload();
    },
  });

  return {
    signIn: mutation.mutate,
    ...mutation,
  };
}
