import { useQuery } from '@tanstack/react-query';
import { User } from '@/types';

let initialLoading = true;

export function useAuth() {
  const { data } = useQuery<{ user: User | null }>({
    queryKey: ['authUser'],
    queryFn: () =>
      fetch('/api/auth/me', { credentials: 'include' })
        .then((r) => r.json())
        .finally(() => {
          initialLoading = false;
        }),
  });

  return {
    isLoading: initialLoading,
    user: data?.user || null,
  };
}
