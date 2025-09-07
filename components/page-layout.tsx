import { ReactNode } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { BottomNavigation } from '@/components/layout/bottom-navigation';

export const PageLayout = ({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
          {header}
        </header>
        <div className="flex-1 py-6 md:py-10 overflow-y-auto">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
};
