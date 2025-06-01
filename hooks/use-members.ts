import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '@/lib/api';
import type { Member } from '@/types';
import { useCurrentWorkspace } from './use-current-workspace';

export function useMembers() {
  const { workspace } = useCurrentWorkspace();
  const { data, ...query } = useQuery({
    queryKey: ['members', workspace?.id],
    queryFn: () =>
      fetch(`/api/workspace/${workspace?.id}/members`, {
        method: 'GET',
        credentials: 'include',
      }).then((r) => r.json()),
    enabled: !!workspace,
  });
  // console.log('Members data:', data);
  return {
    members: data?.members || [],
    // meta: data?.members?.meta || {},
    ...query,
  };
}

// export function useCreateStudent() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: api.students.create,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['students'] });
//     },
//   });
// }

// export function useUpdateStudent() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, ...data }: { id: string } & Partial<Student>) =>
//       api.students.update(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['students'] });
//     },
//   });
// }

// export function useDeleteStudent() {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: api.students.delete,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['students'] });
//     },
//   });
// }
