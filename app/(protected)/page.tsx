'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Spinner } from '@/components/ui/spinner';
import NoWorkspaceState from '@/components/workspaces/no-workspace-state';

export default function RedirectPage() {
  const { workspaces, isLoading } = useWorkspaces();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      router.replace(`/w/${firstWorkspace.slug}`);
    }
  }, [isLoading, workspaces, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  if (workspaces.length === 0) {
    return <NoWorkspaceState />;
  }

  return null;
}
