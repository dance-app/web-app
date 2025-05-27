import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { User } from '@/types';
import { useSetAtom } from 'jotai';
import { authAtom, authUserAtom } from '@/lib/atoms';

export function useSignIn({
  onSuccess,
}: { onSuccess?: (user: User) => void } = {}) {
  const setAuth = useSetAtom(authAtom);
  const setAuthUser = useSetAtom(authUserAtom);
  const mutation = useMutation({
    mutationFn: api.auth.signIn,
    onSuccess: (data) => {
      if ('user' in data) {
        setAuth({
          status: 'authenticated',
          token: data.accessToken,
          refreshToken: data.refreshToken,
        });
        setAuthUser({ user: data.user });
        if (onSuccess) {
          onSuccess(data.user);
        }
      }
    },
    // onError: (error: unknown) => {
    //   // if (error.message === 'Credentials not correct') {
    //   //   console.error('Invalid email or password');
    //   // }
    //   console.error('Login failed', error);
    // },
  });
  return {
    signIn: mutation.mutate,
    ...mutation,
  };
}
