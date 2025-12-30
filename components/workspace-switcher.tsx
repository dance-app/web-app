'use client';

import { useState } from 'react';
import { Check, ChevronDown, Settings, Building2 } from 'lucide-react';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Workspace } from '@/types';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspaces } = useWorkspaces();
  const router = useRouter();
  const { workspace: currentWorkspace } = useCurrentWorkspace();

  const handleWorkspaceSwitch = (slug: Workspace['slug']) => {
    setIsOpen(false);
    router.push(`/w/${slug}`);
  };

  const handleSettings = () => {
    setIsOpen(false);
    if (currentWorkspace) {
      router.push(`/w/${currentWorkspace.slug}/settings`);
    }
  };

  if (!currentWorkspace) return null;

  const hasMultipleWorkspaces = workspaces.length > 1;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 py-2 h-auto bg-transparent border-none hover:bg-gray-100"
        >
          <Building2 className="h-4 w-4" />
          <span className="font-medium truncate max-w-[140px]">
            {currentWorkspace.name}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Workspace
        </DropdownMenuLabel>

        {hasMultipleWorkspaces && (
          <>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Building2 className="mr-2 h-4 w-4" />
                Switch workspace
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-48">
                {workspaces.map((workspace) => {
                  const isSelected = workspace.id === currentWorkspace.id;

                  return (
                    <DropdownMenuItem
                      key={workspace.id}
                      onClick={() => handleWorkspaceSwitch(workspace.slug)}
                      disabled={isSelected}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="truncate">{workspace.name}</span>
                        {isSelected && (
                          <Check className="ml-2 h-4 w-4 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
