import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useCurrentWorkspace } from './use-current-workspace';
import { apiCall } from '@/lib/api/client';
import type { Member, WorkspaceRole, DanceRole } from '@/types';

type CreateMemberPayload = {
  email?: string;
  memberName?: string;
  userId?: string;
  roles?: WorkspaceRole[];
  preferredDanceRole?: DanceRole;
  level?: number;
};

export function useMemberCreate() {
  const { workspace } = useCurrentWorkspace();
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const accessToken =
    typeof session?.accessToken === 'string' ? session.accessToken : undefined;

  const mutation = useMutation({
    mutationFn: async (payload: CreateMemberPayload) => {
      if (!workspace) {
        throw new Error('No workspace selected');
      }

      if (!accessToken) {
        throw new Error('Missing access token');
      }

      const response = await apiCall<Member>(`/workspaces/${workspace.slug}/members`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: payload,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members', workspace?.slug] });
    },
  });

  return {
    create: mutation.mutateAsync,
    ...mutation,
  };
}
