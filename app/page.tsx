"use client"

import { AuthGuard } from "@/components/auth-guard"
import { WorkspaceGuard } from "@/components/workspace-guard"

export default function DashboardPage() {
  return (
    <AuthGuard mode="requiredAuth">
      <WorkspaceGuard>
        wip
      </WorkspaceGuard>
    </AuthGuard>
  )
}
