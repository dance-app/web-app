import type { Student } from "@/types"

// Mock API functions - replace with real API calls
export const studentsApi = {
  getStudents: async (): Promise<Student[]> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return [
      {
        id: "1",
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "leader",
        level: "advanced",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        name: "Bob Smith",
        email: "bob@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "follower",
        level: "intermediate",
        createdAt: new Date("2024-01-16"),
        updatedAt: new Date("2024-01-16"),
      },
      {
        id: "3",
        name: "Carol Davis",
        email: "carol@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "both",
        level: "beginner",
        createdAt: new Date("2024-01-17"),
        updatedAt: new Date("2024-01-17"),
      },
      {
        id: "4",
        name: "David Wilson",
        email: "david@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "leader",
        level: "intermediate",
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-01-18"),
      },
      {
        id: "5",
        name: "Eva Brown",
        email: "eva@example.com",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "follower",
        level: "advanced",
        createdAt: new Date("2024-01-19"),
        updatedAt: new Date("2024-01-19"),
      },
    ]
  },

  createStudent: async (student: Omit<Student, "id" | "createdAt" | "updatedAt">): Promise<Student> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      ...student,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },

  updateStudent: async (id: string, student: Partial<Student>): Promise<Student> => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      id,
      name: student.name || "",
      email: student.email || "",
      avatar: student.avatar,
      role: student.role || "follower",
      level: student.level || "beginner",
      createdAt: student.createdAt || new Date(),
      updatedAt: new Date(),
    }
  },

  deleteStudent: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300))
  },
}

export const authApi = {
  signIn: async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "teacher@example.com" && password === "password") {
      return {
        user: {
          id: "1",
          email: "teacher@example.com",
          name: "John Teacher",
        },
      }
    }

    throw new Error("Invalid credentials")
  },

  signUp: async (name: string, email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
      },
    }
  },
}
