import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { Member, LocalApiResponse } from '@/types';

type UpdateMemberResponse = LocalApiResponse<
  { member: Member },
  'MEMBER_NOT_FOUND' | 'UNAUTHORIZED'
>;

interface UpdateMemberData extends Pick<Member, 'id' | 'name' | 'email'> {}

export function useMemberUpdate() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMemberData) => {
      if (!workspace) {
        throw new Error('No workspace selected');
      }

      const { id, ...updateData } = data;
      const response = await fetch(
        `/api/workspace/${workspace.slug}/members/${id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(updateData),
        }
      );

      const result: UpdateMemberResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error.message || 'Failed to update member');
      }

      return result.data.member;
    },
    onSuccess: () => {
      // Invalidate the members query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['members', workspace?.slug] });
    },
  });
}
