'use client';

import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { usePathname } from 'next/navigation';
import { currentWorkspaceSlugAtom } from '@/lib/atoms';

export function useCurrentWorkspaceSlug() {
  const [currentSlug, setCurrentSlug] = useAtom(currentWorkspaceSlugAtom);
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split('/');
    
    // Expects path like: /w/{slug}/...
    const slugFromPath = segments.length >= 3 && segments[1] === 'w' 
      ? segments[2] 
      : null;
    
    // Update atom with current slug from path
    setCurrentSlug(slugFromPath);
  }, [pathname, setCurrentSlug]);

  return {
    slug: currentSlug,
    setWorkspaceSlug: setCurrentSlug,
  };
}
