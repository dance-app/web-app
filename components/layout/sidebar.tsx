"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Home, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { AuthAvatar } from "@/components/auth-avatar"
import { useCurrentWorkspaceSlug } from "@/hooks/use-current-workspace-slug"

const navigation = [
  { name: "Home", path: "", icon: Home },
  { name: "Students", path: "students", icon: Users },
  { name: "Classes", path: "classes", icon: Calendar },
  { name: "Subscriptions", path: "subscriptions", icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()
  const slug = useCurrentWorkspaceSlug()

  if (!slug) return null // You might want a fallback UI here

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-16 w-full items-center justify-between px-6 border-b">
        <h1 className="text-sm font-semibold">Dance App</h1>
        <AuthAvatar />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const fullHref = `/w/${slug}/${item.path}`
          const isActive = pathname === fullHref
          // const isActive = pathname.startsWith(fullHref)

          return (
            <Link
              key={item.name}
              href={fullHref}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
