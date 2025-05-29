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
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (mode === "requiredAuth" && !user) {
      router.push("/auth/sign-in")
    } else if (mode === "noAuthOnly" && user) {
      router.push("/")
    }
  }, [isLoading, mode, router, user])

  if (isLoading) return null
  if (mode === "requiredAuth" && !user) return null
  if (mode === "noAuthOnly" && user) return null

  return <>{children}</>
}
