"use client"

import { useState, useMemo } from "react"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StudentsTable } from "@/components/students/students-table"
import { StudentForm } from "@/components/students/student-form"
import { useStudents, useCreateStudent, useUpdateStudent, useDeleteStudent } from "@/hooks/use-students"
import type { Student } from "@/types"

export default function StudentsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [levelFilter, setLevelFilter] = useState<string>("all")

  const { data: students = [], isLoading } = useStudents()
  const createStudent = useCreateStudent()
  const updateStudent = useUpdateStudent()
  const deleteStudent = useDeleteStudent()

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesRole = roleFilter === "all" || student.role === roleFilter
      const matchesLevel = levelFilter === "all" || student.level === levelFilter

      return matchesSearch && matchesRole && matchesLevel
    })
  }, [students, searchTerm, roleFilter, levelFilter])

  const handleCreateStudent = async (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
    try {
      await createStudent.mutateAsync(data)
      setIsFormOpen(false)
    } catch (error) {
      console.error("Failed to create student:", error)
    }
  }

  const handleUpdateStudent = async (data: Omit<Student, "id" | "createdAt" | "updatedAt">) => {
    if (!editingStudent) return

    try {
      await updateStudent.mutateAsync({
        id: editingStudent.id,
        ...data,
      })
      setEditingStudent(null)
    } catch (error) {
      console.error("Failed to update student:", error)
    }
  }

  const handleDeleteStudent = async (id: string) => {
    try {
      await deleteStudent.mutateAsync(id)
    } catch (error) {
      console.error("Failed to delete student:", error)
    }
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingStudent(null)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Students</h1>
        <p className="text-gray-600">Manage your student roster</p>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="leader">Leader</SelectItem>
            <SelectItem value="follower">Follower</SelectItem>
            <SelectItem value="both">Both</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Levels</SelectItem>
            <SelectItem value="beginner">Beginner</SelectItem>
            <SelectItem value="intermediate">Intermediate</SelectItem>
            <SelectItem value="advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <StudentsTable
        students={filteredStudents}
        onEdit={handleEdit}
        onDelete={handleDeleteStudent}
        isLoading={isLoading}
      />

      <StudentForm
        open={isFormOpen || !!editingStudent}
        onOpenChange={handleCloseForm}
        onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
        initialData={editingStudent || undefined}
        isLoading={createStudent.isPending || updateStudent.isPending}
      />
    </div>
  )
}
