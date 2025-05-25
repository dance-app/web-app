"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAtom } from "jotai"
import { Users, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authAtom } from "@/lib/atoms"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Students", href: "/students", icon: Users },
]

export function Sidebar() {
  const pathname = usePathname()
  const [auth, setAuth] = useAtom(authAtom)

  const handleSignOut = () => {
    setAuth({ user: null, isAuthenticated: false })
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gray-50 border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-semibold">Student Manager</h1>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-gray-200 text-gray-900" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center mb-3">
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">{auth.user?.name}</p>
            <p className="text-xs text-gray-500">{auth.user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
