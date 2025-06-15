import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';

export function useMaterials() {
  const { workspace } = useCurrentWorkspace();

  const { data, ...query } = useQuery({
    queryKey: ['materials', workspace?.id],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.id}/materials`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    materials: data?.materials || [],
    ...query,
  };
}
