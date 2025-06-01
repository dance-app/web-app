"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useWorkspaces } from "@/hooks/use-workspaces"
import { Loader2 } from "lucide-react"
import { Workspace } from "@/types"
import NoWorkspaceState from "./workspaces/no-workspace-state"

const isValidSlug = (workspaces: Workspace[], slug?: string) => !!workspaces.some((ws) => ws.slug === slug)

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const { workspaces, isLoading } = useWorkspaces()
  const router = useRouter()
  const params = useParams<{ slug?: string }>()
  const currentSlug = params?.slug

  useEffect(() => {
    if (isLoading) return

    // No workspaces at all
    if (workspaces && "error" in workspaces) return
    if (!workspaces || workspaces.length === 0) return

    // At root path with no slug → redirect to first workspace
    if (!currentSlug && !!workspaces.length) {
      router.push(`/w/${workspaces[0].slug}`)
    }
  }, [isLoading, workspaces, currentSlug, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-muted-foreground">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading workspace access...
      </div>
    )
  }

  if (workspaces && workspaces.length === 0) {
    // return (
    //   <div className="flex flex-col items-center justify-center h-screen text-center px-6">
    //     <h2 className="text-xl font-semibold mb-2">No workspaces found</h2>
    //     <p className="text-muted-foreground text-sm mb-4">
    //       You don’t have any workspaces yet. Please contact your administrator or create one.
    //     </p>
    //   </div>
    // )
    return <NoWorkspaceState />
  }

  if (currentSlug && !isValidSlug(workspaces, currentSlug)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h2 className="text-xl font-semibold mb-2">Invalid workspace</h2>
        <p className="text-muted-foreground text-sm">
          The workspace you’re trying to access doesn’t exist or you don’t have access to it.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
