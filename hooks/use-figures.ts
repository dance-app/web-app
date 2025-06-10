import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useFigures() {
  const { workspace } = useCurrentWorkspace();
  
  const { data, ...query } = useQuery({
    queryKey: ['figures', workspace?.id],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.id}/figures`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    figures: data?.figures || [],
    ...query,
  };
}