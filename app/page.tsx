"use client"

import { AppShell } from "@/components/app-shell"
import { Spinner } from "@/components/ui/spinner"

export default function DashboardPage() {
  return (
    <AppShell mode="requiredAuth" requireWorkspace={true}>
      <Spinner />
    </AppShell>
  )
}
