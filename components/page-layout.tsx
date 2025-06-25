import { ReactNode } from 'react';

export const PageLayout = ({
  header,
  children,
}: {
  header: ReactNode;
  children: ReactNode;
}) => {
  return (
    <div className="flex flex-col">
      <header className="flex h-12 shrink-0 items-center justify-between gap-2 px-4">
        {header}
      </header>
      <div className="flex-1 py-6 md:py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
};
