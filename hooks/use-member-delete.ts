import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentWorkspace } from './use-current-workspace';
import type { Member } from '@/types';
import { DeleteMemberResponse } from '@/app/api/workspace/[slug]/members/[id]/route';

export function useMemberDelete() {
  const { workspace } = useCurrentWorkspace();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: Member['id']) => {
      if (!workspace) {
        throw new Error('No workspace selected');
      }

      const response = await fetch(
        `/api/workspace/${workspace.slug}/members/${memberId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const result: DeleteMemberResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error.message || 'Failed to delete member');
      }

      return result.data.member;
    },
    onSuccess: () => {
      // Invalidate the members query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['members', workspace?.slug] });
    },
  });
}
