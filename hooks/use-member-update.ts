import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCurrentWorkspace } from './use-current-workspace';
import { apiCall } from '@/lib/api/client';
import type { Member, WorkspaceRole, DanceRole } from '@/types';

interface UpdateMemberData {
  id: string;
  memberName?: string;
  email?: string;
  phone?: string | null;
  roles?: WorkspaceRole[];
  preferredDanceRole?: DanceRole;
  level?: number;
}

export function useMemberUpdate() {
  const { workspace } = useCurrentWorkspace();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined;

  return useMutation({
    mutationFn: async (data: UpdateMemberData) => {
      if (!workspace) {
        throw new Error('No workspace selected');
      }
      if (!accessToken) {
        throw new Error('Missing access token');
      }

      const { id, ...updateData } = data;

      const response = await apiCall<Member>(
        `/workspaces/${workspace.slug}/members/${id}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: updateData,
        }
      );

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', workspace?.slug] });
    },
  });
}
