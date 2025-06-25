'use client';

import { useState } from 'react';
import { Pen } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type Member } from '@/types';

interface MembersTableProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (id: string) => void;
  onMemberClick: (member: Member) => void;
  isLoading?: boolean;
}

export function MembersTable({
  members,
  onEdit,
  onDelete,
  onMemberClick,
  isLoading,
}: MembersTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  const handleEdit = (e: React.MouseEvent, member: Member) => {
    e.stopPropagation();
    onEdit(member);
  };

  if (isLoading) {
    return (
      <div className="space-y-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-2 group rounded-md"
          >
            <div className="flex items-center space-x-4">
              <div className="h-6 w-6 rounded-full bg-gray-200 animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-gray-500 text-lg mb-2">No members found</div>
        <div className="text-gray-400 text-sm">
          Try adjusting your search or add new members
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-1">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => onMemberClick(member)}
            className="flex items-center justify-between p-2 hover:bg-gray-100 transition-all duration-200 cursor-pointer group rounded-md"
          >
            <div className="flex items-center flex-1 gap-4">
              <Avatar>
                <AvatarFallback>
                  {member.name[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="font-small text-sm text-gray-600 group-hover:text-gray-700 transition-colors">
                {member.name}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={(e) => handleEdit(e, member)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 h-6"
              >
                <Pen />
                <span className="text-xs">Edit</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              student from your records.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
