import { CreateWorkspaceResponse } from '@/app/api/workspace/route';
import { Workspace } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCurrentUser } from './use-current-user';

export function useWorkspaceCreate({
  onSuccess,
}: { onSuccess?: (workspace: Workspace) => void } = {}) {
  const queryClient = useQueryClient();
  const { user } = useCurrentUser();

  const mutation = useMutation({
    mutationFn: async ({
      name,
    }: {
      name: string;
    }) => {
      if (!user?.id) {
        throw new Error('You must be logged in to create a workspace');
      }

      const result = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), ownerId: user.id }),
        credentials: 'include',
      });
      const body: CreateWorkspaceResponse = await result.json();
      if (!body.success)
        throw new Error(body.error.message || 'Failed to create workspace.');
      return body.data.workspace;
    },
    onSuccess: async (newWorkspace) => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      onSuccess?.(newWorkspace);
    },
  });

  return {
    create: mutation.mutate,
    ...mutation,
  };
}
