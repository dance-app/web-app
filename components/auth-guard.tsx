"use client"

import type React from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

interface AuthGuardProps {
  children: React.ReactNode
  mode: "requiredAuth" | "optionalAuth" | "noAuthOnly"
}

export function AuthGuard({ children, mode = "requiredAuth" }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return

    if (mode === "requiredAuth" && !isAuthenticated) {
      router.push("/auth/sign-in")
    } else if (mode === "noAuthOnly" && isAuthenticated) {
      router.push("/")
    }
  }, [isAuthenticated, isLoading, mode, router])

  if (isLoading) return null
  if (mode === "requiredAuth" && !isAuthenticated) return null
  if (mode === "noAuthOnly" && isAuthenticated) return null

  return <>{children}</>
}
