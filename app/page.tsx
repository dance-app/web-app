"use client"

import { AuthGuard } from "@/components/auth-guard"
import { Spinner } from "@/components/ui/spinner"
import { WorkspaceGuard } from "@/components/workspace-guard"

export default function DashboardPage() {
  return (
    <AuthGuard mode="requiredAuth">
      <WorkspaceGuard>
        <Spinner />
      </WorkspaceGuard>
    </AuthGuard>
  )
}
