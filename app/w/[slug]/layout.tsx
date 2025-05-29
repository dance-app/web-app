"use client"

import type React from "react"

import { AuthGuard } from "@/components/auth-guard"
import { Sidebar } from "@/components/layout/sidebar"
import { WorkspaceGuard } from "@/components/workspace-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard mode="requiredAuth">
      <WorkspaceGuard>
        <div className="flex h-screen bg-gray-50">
          <Sidebar />
          <main className="flex-1 overflow-auto">{children}</main>
        </div>
      </WorkspaceGuard>
    </AuthGuard>
  )
}
