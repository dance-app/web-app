'use client';

import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MembersTable } from '@/components/members/members-table';
import { useMembers } from '@/hooks/use-members';
import { useSelectedMember } from '@/hooks/use-selected-member';
import { useMemberDelete } from '@/hooks/use-member-delete';
import type { Member } from '@/types';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { MemberDetailDrawer } from '@/components/members/member-details-drawer';
import { MemberCreateModal } from '@/components/members/member-create-modal';
import { PageLayout } from '@/components/page-layout';
import { Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function MembersPage() {
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { members, isLoading } = useMembers();
  const { selectedMember, setSelectedMember } = useSelectedMember(members);
  const { mutate: deleteMember } = useMemberDelete();

  const createStudent = () => { }; //useCreateStudent()
  const updateStudent = () => { }; //useUpdateStudent()
  const deleteStudent = () => { }; //useDeleteStudent()

  // const handleCreateStudent = async (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
  //   try {
  //     await createStudent.mutateAsync(data)
  //     setIsFormOpen(false)
  //   } catch (error) {
  //     console.error("Failed to create student:", error)
  //   }
  // }

  // const handleUpdateStudent = async (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
  //   if (!editingStudent) return

  //   try {
  //     await updateStudent.mutateAsync({
  //       id: editingStudent.id,
  //       ...data,
  //     })
  //     setEditingStudent(null)
  //   } catch (error) {
  //     console.error("Failed to update student:", error)
  //   }
  // }

  // const handleDeleteStudent = async (id: string) => {
  //   try {
  //     await deleteStudent.mutateAsync(id)
  //   } catch (error) {
  //     console.error("Failed to delete student:", error)
  //   }
  // }

  // const handleEdit = (student: Student) => {
  //   setEditingStudent(student)
  //   setShowDrawer(true)
  // }

  // const handleCloseForm = () => {
  //   setIsFormOpen(false)
  //   setEditingStudent(null)
  // }

  const handleDeleteMember = (memberId: string) => {
    deleteMember(memberId);
  };

  const handleFormSubmit = async (data: Partial<Member>) => {
    //   const result = {
    //     success: true,
    //     error: undefined,
    //   }
    //   if (editingStudent) {
    //     // const result = await updateStudent(selectedStudent.id, data)
    //     if (result.success) {
    //       toast.success("Student updated successfully")
    //     } else {
    //       toast.error(result.error || "Failed to update student")
    //     }
    //     return result
    //   } else {
    //     // const result = await createStudent(data)
    //     if (result.success) {
    //       toast.success("Student created successfully")
    //     } else {
    //       toast.error(result.error || "Failed to create student")
    //     }
    //     return result
    //   }
  };

  return (
    <PageLayout
      header={
        <>
          <Breadcrumbs
            title={
              <div className='flex items-center gap-2'>
                <Users size={16} />
                Members
              </div>
            }
          />
          <div className="flex gap-2">
            <div className="relative flex-1 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <TooltipProvider>
              <Tooltip>
                <MemberCreateModal>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8'>
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                </MemberCreateModal>
                <TooltipContent>
                  <p>Add new member</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      }
    >
      <MembersTable
        members={members}
        onEdit={setSelectedMember}
        onDelete={() => { }}
        onMemberClick={setSelectedMember}
        isLoading={isLoading}
      />

      <MemberDetailDrawer
        member={selectedMember}
        open={!!selectedMember}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMember(null);
          }
        }}
        onSubmit={() =>
          new Promise((resolve) => resolve({ success: true, error: undefined }))
        }
        onDelete={handleDeleteMember}
      />
    </PageLayout >
  );
}
