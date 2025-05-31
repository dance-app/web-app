import { User } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useSignUp() {
  const queryClient = useQueryClient();
  // const router = useRouter();

  const mutation = useMutation({
    mutationFn: ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) =>
      fetch('/api/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
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
    signUp: mutation.mutate,
    ...mutation,
  };
}
