"use client"

import { useAtom } from "jotai"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authAtom } from "@/lib/atoms"

export default function DashboardPage() {
  const [auth] = useAtom(authAtom)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {auth.user?.name}!</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Student Management System</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage your students efficiently with our comprehensive tools. Add, edit, and organize student information
              with ease.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Add new students</li>
              <li>• Update student information</li>
              <li>• Manage roles and levels</li>
              <li>• Export student data</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Next steps</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Navigate to the Students section to begin managing your student roster. You can add new students, edit
              existing ones, and organize them by role and level.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
