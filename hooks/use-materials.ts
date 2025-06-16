import { useQuery } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import { MaterialsResponse } from '@/types/material';

export function useMaterials() {
  const { workspace } = useCurrentWorkspace();

  const { data, ...query } = useQuery<MaterialsResponse>({
    queryKey: ['materials', workspace?.slug],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.slug}/materials`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });

  return {
    materials: data?.materials.data || [],
    meta: data?.materials.meta || {},
    ...query,
  };
}
