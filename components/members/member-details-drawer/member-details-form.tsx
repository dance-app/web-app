import { Calendar, Trash2 } from 'lucide-react'
import { format } from 'date-fns';
import React, { useState } from 'react'
import { Member } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput, isValidPhoneNumber } from '@/components/ui/phone-input';
import { SheetFooter } from '@/components/ui/sheet';
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
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

export const MemberDetailsForm = ({ member, onDelete }: {
  member: Pick<Member, 'id' | 'createdAt' | 'name' | 'email' | 'phone'>
  onDelete?: (memberId: string) => void
}) => {
  const [formData, setFormData] = useState({
    name: member.name || '',
    email: member.email || '',
    phone: member.phone || '',
  });
  const [phoneError, setPhoneError] = useState<string | null>(null);

  const updateMember = useMemberUpdate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    if (formData.phone && !isValidPhoneNumber(formData.phone)) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    try {
      await updateMember.mutateAsync({
        id: member.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
      });

      toast({
        title: "Success",
        description: "Member updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update member",
        variant: "destructive",
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  return (
    <form onSubmit={handleSubmit} className='flex flex-1 flex-col py-10'>
      {updateMember.isError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {updateMember.error instanceof Error
              ? updateMember.error.message
              : 'Failed to update member'
            }
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone</Label>
          <PhoneInput
            value={formData.phone}
            onChange={(value) =>
              setFormData((prev) => ({ ...prev, phone: value || '' }))
            }
            defaultCountry="US"
            placeholder="Phone number"
          />
          {phoneError && (
            <p className="text-sm text-destructive">{phoneError}</p>
          )}
        </div>
        {/* <div className="grid gap-2">
          <Label htmlFor="danceRole">Dance Role</Label>
          <Select
            value={formData.danceRole}
            onValueChange={(value) =>
              handleSelectChange('danceRole', value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="leader">Leader</SelectItem>
              <SelectItem value="follower">Follower</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div> */}

        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            Member Since
          </p>
          <p className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {member.createdAt ? format(new Date(member.createdAt), 'PPP') : 'N/A'}
          </p>
        </div>
      </div>

      <SheetFooter className="mt-6">
        {onDelete && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:text-destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete {member.name}</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <strong>{member.name}</strong>? This action cannot be undone and will permanently remove the member from your workspace.
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
        )}
        <Button type="submit" disabled={updateMember.isPending}>
          {updateMember.isPending ? 'Saving...' : 'Save'}
        </Button>
      </SheetFooter>
    </form>
  )
}
