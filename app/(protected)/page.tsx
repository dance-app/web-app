'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Spinner } from '@/components/ui/spinner';
import NoWorkspaceState from '@/components/workspaces/no-workspace-state';

export default function RedirectPage() {
  const { workspaces, isLoading } = useWorkspaces();
  // const { getPreferredWorkspace } = useCurrentWorkspace();
  // console.log('getPreferredWorkspace', getPreferredWorkspace);
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (workspaces.length > 0) {
      const firstWorkspace = workspaces[0];
      router.push(`/w/${firstWorkspace.slug}`);
    } else {
      // router.push('/get-started');
      console.log('No workspaces found, showing no workspace state');
    }
  }, [isLoading]);

  // if (isLoading) {
  //   return (
  //     <div className="flex items-center justify-center h-screen text-muted-foreground">
  //       <Spinner />
  //     </div>
  //   );
  // }
  // console.log('workspaces.length', workspaces.length);
  return (
    <div className="flex items-center justify-center h-screen text-muted-foreground">
      <Spinner />
    </div>
  );
}
