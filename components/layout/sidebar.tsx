'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, Home, Calendar, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthAvatar } from '@/components/auth-avatar';
import { WorkspaceSwitcher } from '@/components/workspace-switcher';
import { Workspace } from '@/types';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';

const navigation = [
  { name: 'Home', path: '', icon: Home },
  { name: 'Members', path: 'members', icon: Users },
  { name: 'Classes', path: 'classes', icon: Calendar },
  { name: 'Materials', path: 'materials', icon: BookOpen },
  { name: 'Subscriptions', path: 'subscriptions', icon: Calendar },
];

export function Sidebar({ fakeWorkspace }: { fakeWorkspace?: Workspace }) {
  const pathname = usePathname();
  const { workspace } = useCurrentWorkspace();

  if (!workspace && !fakeWorkspace) return null;

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-12 w-full items-center justify-between px-3 gap-2">
        <div className="flex-1 min-w-0">
          {workspace ? (
            <WorkspaceSwitcher />
          ) : (
            <h1 className="text-sm font-semibold truncate px-3 py-2">
              {fakeWorkspace?.name}
            </h1>
          )}
        </div>
        <AuthAvatar />
      </div>

      <nav className="flex-1 px-3 py-4">
        {navigation.map((item) => {
          const fullHref = `/w/${workspace?.slug}/${item.path}`;
          const isActive = pathname === fullHref;

          return (
            <Link
              key={item.name}
              href={fullHref}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-gray-200 text-gray-800'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
