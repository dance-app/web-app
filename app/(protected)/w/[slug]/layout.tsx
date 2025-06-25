'use client';

import type React from 'react';
import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { Sidebar } from '@/components/layout/sidebar';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { workspaces, isLoading } = useWorkspaces();
  const params = useParams<{ slug: string }>();
  // const router = useRouter();
  const currentSlug = params?.slug;

  // Validate workspace slug
  // useEffect(() => {
  //   if (!currentSlug || isLoading) return;

  //   const isValidSlug = workspaces.some((ws) => ws.slug === currentSlug);
  //   if (!isValidSlug && workspaces.length > 0) {
  //     // Invalid workspace - redirect to first workspace
  //     const firstWorkspace = workspaces[0];
  //     router.push(`/w/${firstWorkspace.slug}`);
  //   }
  // }, [currentSlug, workspaces, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  // Show nothing while validating workspace
  if (currentSlug && workspaces.length > 0) {
    const isValidSlug = workspaces.some((ws) => ws.slug === currentSlug);

    if (!isValidSlug) {
      return null; // Will redirect via useEffect
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
