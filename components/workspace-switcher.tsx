'use client';

import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorkspaces } from '@/hooks/use-workspaces';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Workspace } from '@/types';

export function WorkspaceSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { workspaces } = useWorkspaces();
  const { workspace: currentWorkspace, switchWorkspace } =
    useCurrentWorkspace();

  const handleWorkspaceSwitch = (workspace: Workspace) => {
    setIsOpen(false);
    switchWorkspace(workspace.slug);
  };

  if (!currentWorkspace) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center justify-between w-full px-3 py-2 text-left text-sm font-semibold',
          'rounded-md transition-colors hover:bg-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          isOpen && 'bg-gray-100'
        )}
      >
        <span className="truncate max-w-[160px] overflow-hidden whitespace-nowrap">
          {currentWorkspace.name}
        </span>
        <ChevronDown
          className={cn(
            'ml-2 h-4 w-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute left-0 right-0 z-20 mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="py-1">
              {workspaces.map((workspace) => {
                const isSelected = workspace.id === currentWorkspace.id;

                return (
                  <button
                    key={workspace.id}
                    onClick={() => handleWorkspaceSwitch(workspace)}
                    disabled={isSelected}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2 text-left text-sm',
                      'hover:bg-gray-50 transition-colors disabled:cursor-default',
                      isSelected && 'bg-blue-50 text-blue-700 hover:bg-blue-50'
                    )}
                  >
                    <span className="truncate flex-1">{workspace.name}</span>
                    {isSelected && (
                      <Check className="ml-2 h-4 w-4 text-blue-700" />
                    )}
                  </button>
                );
              })}
            </div>

            {workspaces.length === 0 && (
              <div className="px-3 py-2 text-sm text-gray-500">
                No workspaces available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
