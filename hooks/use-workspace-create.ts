import { CreateWorkspaceResponse } from '@/app/api/workspace/route';
import { User, Workspace } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useWorkspaceCreate({
  onSuccess,
}: { onSuccess?: (workspace: Workspace) => void } = {}) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async ({
      name,
      ownerId,
    }: {
      name: string;
      ownerId: User['id'];
    }) => {
      const result = await fetch('/api/workspace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), ownerId: ownerId }),
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
