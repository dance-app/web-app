'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { Loader2, Check, Trash2 } from 'lucide-react';
import { Member, DanceRole, WorkspaceRole } from '@/types';
import { EditableField } from '@/components/ui/editable-field';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMemberUpdate } from '@/hooks/use-member-update';
import { useToast } from '@/hooks/use-toast';

type SaveStatus = 'idle' | 'saving' | 'saved';

const DANCE_ROLE_OPTIONS = [
  { label: 'Leader', value: DanceRole.LEADER },
  { label: 'Follower', value: DanceRole.FOLLOWER },
];

const WORKSPACE_ROLE_OPTIONS = [
  { label: 'Owner', value: WorkspaceRole.OWNER },
  { label: 'Teacher', value: WorkspaceRole.TEACHER },
  { label: 'Student', value: WorkspaceRole.STUDENT },
];

interface MemberDetailsFormProps {
  member: Member;
  onDelete?: (memberId: string) => void;
}

export const MemberDetailsForm = ({ member, onDelete }: MemberDetailsFormProps) => {
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateMember = useMemberUpdate();
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleFieldSave = useCallback(
    async (apiField: string, value: unknown) => {
      setSaveStatus('saving');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      try {
        await updateMember.mutateAsync({
          id: member.id,
          [apiField]: value,
        });
        setSaveStatus('saved');
        timeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('idle');
        toast({
          title: 'Error',
          description:
            error instanceof Error ? error.message : 'Failed to update member',
          variant: 'destructive',
        });
      }
    },
    [member.id, updateMember, toast]
  );

  const primaryRole = member.roles[0] ?? '';
  const hasUser = !!member.user;
  const userManagedTooltip = 'Managed by the user\'s account';

  const displayName = hasUser
    ? `${member.user!.firstName} ${member.user!.lastName}`
    : member.name || '';

  const displayEmail = member.email || member.user?.accounts?.[0].email || '';

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {saveStatus === 'saving' && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Saving...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <Check className="h-3 w-3" />
              <span>Saved</span>
            </>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          Updated {formatDistanceToNow(new Date(member.updatedAt), { addSuffix: true })}
        </span>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col py-4">
        {hasUser ? (
          <EditableField
            label="Name"
            type="readonly"
            value={displayName}
            tooltip={userManagedTooltip}
          />
        ) : (
          <EditableField
            label="Name"
            type="text"
            value={displayName}
            onSave={(v) => handleFieldSave('memberName', v)}
            placeholder="Full name"
          />
        )}

        {hasUser ? (
          <EditableField
            label="Email"
            type="readonly"
            value={displayEmail}
            tooltip={userManagedTooltip}
          />
        ) : (
          <EditableField
            label="Email"
            type="text"
            value={displayEmail}
            onSave={(v) => handleFieldSave('email', v)}
            inputType="email"
            placeholder="Email address"
          />
        )}

        <EditableField
          label="Phone"
          type="text"
          value={member.phone || ''}
          onSave={(v) => handleFieldSave('phone', v || null)}
          inputType="tel"
          placeholder="Phone number"
        />

        <Separator className="my-2" />

        <EditableField
          label="Dance Role"
          type="select"
          value={member.preferredDanceRole || ''}
          onSave={(v) => handleFieldSave('preferredDanceRole', v)}
          options={DANCE_ROLE_OPTIONS}
          placeholder="Select role"
        />

        <EditableField
          label="Workspace Role"
          type="select"
          value={primaryRole}
          onSave={(v) => handleFieldSave('roles', [v])}
          options={WORKSPACE_ROLE_OPTIONS}
          placeholder="Select role"
        />

        <Separator className="my-2" />

        <EditableField
          label="Member Since"
          type="readonly"
          value={member.createdAt ? format(new Date(member.createdAt), 'PPP') : 'N/A'}
        />
      </div>

      {onDelete && (
        <div className="pt-4">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Member
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {member.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete{' '}
                  <strong>{member.name}</strong>? This action cannot be undone
                  and will permanently remove the member from your workspace.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(member.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
};
