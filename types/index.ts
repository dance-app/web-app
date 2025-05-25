export interface Student {
  id: string
  name: string
  email: string
  avatar?: string
  role: "leader" | "follower" | "both"
  level: "beginner" | "intermediate" | "advanced"
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  name: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
