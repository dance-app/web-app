'use client';

import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSignOut } from '@/hooks/use-sign-out';

export function AuthAvatar() {
  const { user } = useAuth();
  const { signOut } = useSignOut();

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

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem disabled>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </TooltipTrigger>
            <TooltipContent side="right">Coming soon</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
