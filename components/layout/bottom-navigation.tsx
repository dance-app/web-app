
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Home, Calendar, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';

const navigation = [
  { name: 'Home', path: '', icon: Home },
  { name: 'Members', path: 'members', icon: Users },
  { name: 'Classes', path: 'classes', icon: Calendar },
  { name: 'Materials', path: 'materials', icon: BookOpen },
  { name: 'Subscriptions', path: 'subscriptions', icon: Calendar },
];

export function BottomNavigation() {
  const pathname = usePathname();
  const { workspace } = useCurrentWorkspace();

  if (!workspace) return null;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 md:hidden">
      <div className="grid h-full max-w-lg grid-cols-5 mx-auto font-medium">
        {navigation.map((item) => {
          const fullHref = `/w/${workspace?.slug}/${item.path}`;
          const isActive = pathname === fullHref;

          return (
            <Link
              key={item.name}
              href={fullHref}
              className={cn(
                'inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 dark:hover:bg-gray-800 group',
                isActive
                  ? 'text-blue-600 dark:text-blue-500'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
