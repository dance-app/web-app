"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MembersTable } from "@/components/members/members-table"
import { useMembers } from "@/hooks/use-members"
import type { Member } from "@/types"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { MemberDetailDrawer } from "@/components/members/member-details-drawer"
import { toast } from "sonner"

export const mockDanceTypes = [
  { id: "1", name: "Salsa", description: "Cuban-style salsa", workspaceId: "1" },
  { id: "2", name: "Bachata", description: "Dominican bachata", workspaceId: "1" },
  { id: "3", name: "Merengue", description: "Traditional merengue", workspaceId: "1" },
  { id: "4", name: "Kizomba", description: "Angolan kizomba", workspaceId: "1" },
  { id: "5", name: "Cha Cha", description: "Cuban cha cha cha", workspaceId: "1" },
]

export default function MembersPage() {
  const [createFormOpen, setCreateFormOpen] = useState(false)
  // const [showDrawer, setShowDrawer] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const { members, isLoading } = useMembers()
  console.log("Members data:", members)
  const createStudent = () => { }//useCreateStudent()
  const updateStudent = () => { }//useUpdateStudent()
  const deleteStudent = () => { }//useDeleteStudent()

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
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <Breadcrumbs title="Members" />
        <div className="flex gap-2" >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setCreateFormOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Member
          </Button>
        </div>
      </header>
      <div className="flex-1 space-y-4 p-4 md:p-8">
        <MembersTable
          members={members}
          onEdit={setSelectedMember}
          onDelete={() => { }}
          isLoading={isLoading}
        />

        <MemberDetailDrawer
          member={selectedMember}
          open={!!selectedMember}
          onOpenChange={() => setSelectedMember(null)}
          // danceTypes={mockDanceTypes}
          onSubmit={() => new Promise((resolve) => resolve({ success: true, error: undefined }))}
        />
      </div>
    </div>
  )
}
