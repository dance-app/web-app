'use client';

import type React from 'react';

import { AppShell } from '@/components/app-shell';
import { Sidebar } from '@/components/layout/sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell mode="requiredAuth" requireWorkspace={true}>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </AppShell>
  );
}
