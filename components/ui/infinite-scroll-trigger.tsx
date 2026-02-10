'use client';

import { useEffect, useRef } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollTriggerProps {
  onLoadMore: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  /** Root margin for the IntersectionObserver (default: 200px to prefetch) */
  rootMargin?: string;
}

export function InfiniteScrollTrigger({
  onLoadMore,
  hasNextPage,
  isFetchingNextPage,
  rootMargin = '200px',
}: InfiniteScrollTriggerProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, rootMargin]);

  if (isFetchingNextPage) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!hasNextPage) {
    return null;
  }

  // Invisible sentinel that triggers the next fetch
  return <div ref={sentinelRef} className="h-1" />;
}
