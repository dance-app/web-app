'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Workspace } from '@/types';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspaces } = useWorkspaces();
  const router = useRouter()
  const { workspace: currentWorkspace } = useCurrentWorkspace();

  const handleWorkspaceSwitch = (slug: Workspace['slug']) => {
    setIsOpen(false);
    router.push(`/w/${slug}`);
  };

  if (!currentWorkspace) return null;

  return (
    <Select
      open={isOpen}
      onOpenChange={setIsOpen}
      onValueChange={handleWorkspaceSwitch}
    >
      <SelectTrigger className="w-[180px] bg-transparent border-none hover:bg-gray-100">
        <SelectValue placeholder={currentWorkspace.name} />
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((workspace) => {
          const isSelected = workspace.id === currentWorkspace.id;

          return (
            <SelectItem
              key={workspace.id}
              value={workspace.slug}
              disabled={isSelected}
              className=''
            >
              <div className="flex items-center justify-between">
                <span className="truncate">{workspace.name}</span>
                {isSelected && (
                  <Check className="ml-2 h-4 w-4 text-blue-500" />
                )}
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
