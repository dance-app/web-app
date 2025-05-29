'use client';

import { usePathname } from 'next/navigation';

export function useCurrentWorkspaceSlug(): string | null {
  const pathname = usePathname();
  const segments = pathname.split('/');

  // Expects path like: /w/{slug}/...
  if (segments.length >= 3 && segments[1] === 'w') {
    return segments[2];
  }

  return null;
}
