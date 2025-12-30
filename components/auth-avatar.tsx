'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSignOut } from '@/hooks/use-sign-out';
import { useCurrentUser } from '@/hooks/use-current-user';

export function AuthAvatar() {
  const { user, isLoading } = useCurrentUser();
  const { signOut } = useSignOut();

  if (isLoading) {
    return null;
  }

  if (!user) {
    console.info(`Not user in AuthAvatar`);
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-6 w-6 rounded-full p-0">
          <Avatar>
            <AvatarImage src={'/placeholder-user.jpg'} alt={user.firstName} />
            <AvatarFallback>
              {`${user.firstName[0]}`.toLocaleUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        <DropdownMenuLabel className="text-sm font-medium">
          {user.firstName}  {user.lastName}
        </DropdownMenuLabel>
        <div className="text-xs text-muted-foreground px-2 pb-2 truncate">
          {user.accounts?.[0]?.email}
        </div>
        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
