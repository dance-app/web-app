"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { useCurrentWorkspace } from "@/hooks/use-current-workspace"
import { Workspace } from "@/types"
import NoWorkspaceState from "./workspaces/no-workspace-state"
import { Spinner } from "./ui/spinner"

interface AppShellProps {
  children: React.ReactNode
  mode: "requiredAuth" | "optionalAuth" | "noAuthOnly"
  requireWorkspace?: boolean
}

const isValidSlug = (workspaces: Workspace[], slug?: string) =>
  !!workspaces.some((ws) => ws.slug === slug)

export function AppShell({
  children,
  mode = "requiredAuth",
  requireWorkspace = false
}: AppShellProps) {
  const { user, isLoading: isAuthLoading } = useAuth()
  const { workspaces, isLoading: isWorkspaceLoading } = useWorkspaces()
  const { workspace: currentWorkspace, getPreferredWorkspace } = useCurrentWorkspace()
  const router = useRouter()
  const params = useParams<{ slug?: string }>()
  const currentSlug = params?.slug

  // Handle authentication redirects
  useEffect(() => {
    if (isAuthLoading) return

    if (mode === "requiredAuth" && !user) {
      router.push("/auth/sign-in")
    } else if (mode === "noAuthOnly" && user) {
      router.push("/")
    }
  }, [isAuthLoading, mode, router, user])

  // Handle workspace redirects (only when authenticated and workspace required)
  useEffect(() => {
    if (isAuthLoading || isWorkspaceLoading || !user || !requireWorkspace) return

    // Handle errors or empty workspace data
    if (workspaces && "error" in workspaces) return
    if (!workspaces || workspaces.length === 0) return

    // At root path with no slug → redirect to preferred workspace
    if (!currentSlug && workspaces.length > 0) {
      const preferredWorkspace = getPreferredWorkspace()

      if (preferredWorkspace) {
        router.push(`/w/${preferredWorkspace.slug}`)
      }
    }
  }, [isAuthLoading, isWorkspaceLoading, workspaces, currentSlug, router, user, requireWorkspace, getPreferredWorkspace])

  // Show unified loading state
  if (isAuthLoading || (requireWorkspace && user && isWorkspaceLoading)) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <Spinner />
      </div>
    )
  }

  // Auth-only checks
  if (mode === "requiredAuth" && !user) return null
  if (mode === "noAuthOnly" && user) return null

  // Workspace-specific checks (only when authenticated and workspace required)
  if (requireWorkspace && user) {
    // No workspaces available
    if (workspaces && workspaces.length === 0) {
      return <NoWorkspaceState />
    }

    // Invalid workspace slug
    if (currentSlug && !isValidSlug(workspaces, currentSlug)) {
      const preferredWorkspace = getPreferredWorkspace()
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center px-6">
          <h2 className="text-xl font-semibold mb-2">Invalid workspace</h2>
          <p className="text-muted-foreground text-sm mb-4">
            The workspace you're trying to access doesn't exist or you don't have access to it.
          </p>
          {preferredWorkspace && (
            <button
              onClick={() => router.push(`/w/${preferredWorkspace.slug}`)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Go to {preferredWorkspace.name}
            </button>
          )}
        </div>
      )
    }
  }

  return <>{children}</>
}
