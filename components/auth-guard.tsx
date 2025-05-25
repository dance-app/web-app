"use client"

import type React from "react"

import { useAtom } from "jotai"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { authAtom } from "@/lib/atoms"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = true }: AuthGuardProps) {
  const [auth] = useAtom(authAtom)
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && !auth.isAuthenticated) {
      router.push("/auth/sign-in")
    } else if (!requireAuth && auth.isAuthenticated) {
      router.push("/")
    }
  }, [auth.isAuthenticated, requireAuth, router])

  if (requireAuth && !auth.isAuthenticated) {
    return null
  }

  if (!requireAuth && auth.isAuthenticated) {
    return null
  }

  return <>{children}</>
}
