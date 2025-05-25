import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { studentsApi } from "@/lib/api"
import type { Student } from "@/types"

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: studentsApi.getStudents,
  })
}

export function useCreateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentsApi.createStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}

export function useUpdateStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & Partial<Student>) => studentsApi.updateStudent(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: studentsApi.deleteStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] })
    },
  })
}
