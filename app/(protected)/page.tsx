'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Spinner } from '@/components/ui/spinner';
import NoWorkspaceState from '@/components/workspaces/no-workspace-state';

export default function RedirectPage() {
  const { workspaces, isLoading } = useWorkspaces();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (workspaces.length > 0) {
      setIsRedirecting(true);
      const firstWorkspace = workspaces[0];
      router.replace(`/w/${firstWorkspace.slug}`);
    }
  }, [isLoading, workspaces, router]);

  // Show loading during initial load or redirect
  if (isLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  // Only show onboarding when we're certain there are no workspaces
  if (workspaces.length === 0) {
    return <NoWorkspaceState />;
  }

  // This should never be reached, but just in case
  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      <Spinner />
    </div>
  );
}
