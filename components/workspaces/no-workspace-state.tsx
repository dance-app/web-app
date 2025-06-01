'use client'

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AuthGuard } from "@/components/auth-guard"
import { Spinner } from "@/components/ui/spinner"
import { Users, Home, Calendar, CreditCard, TrendingUp, DollarSign, UserCheck } from "lucide-react"
import { Sidebar } from "../layout/sidebar"

interface CreateWorkspaceForm {
  name: string
}

export default function NoWorkspaceState() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateWorkspaceForm>({
    defaultValues: { name: "" },
    mode: "onChange",
  })

  // Dynamically show the workspace name in the mock
  const workspaceName = watch("name") || "Your Workspace"

  const onSubmit = async (data: CreateWorkspaceForm) => {
    try {
      const res = await fetch("/api/workspace", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name.trim() }),
        credentials: "include",
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || "Failed to create workspace.")
      }
      const created = await res.json()
      const newSlug = created.workspace?.slug
      if (newSlug) {
        router.push(`/w/${newSlug}`)
      } else {
        router.push("/")
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  // Fake stats for the mock dashboard
  const statCards = [
    {
      title: "Total Students",
      value: 120,
      description: "Active students",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Total Classes",
      value: 8,
      description: "This month",
      icon: Calendar,
      color: "text-green-600",
    },
    {
      title: "Active Subscriptions",
      value: 75,
      description: "Current subs",
      icon: CreditCard,
      color: "text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "$4,500",
      description: "Generated",
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Attendance Rate",
      value: "85%",
      description: "Average",
      icon: UserCheck,
      color: "text-orange-600",
    },
    {
      title: "Total Participations",
      value: 230,
      description: "Entries",
      icon: TrendingUp,
      color: "text-indigo-600",
    },
  ]

  const navigation = [
    { name: "Home", icon: Home },
    { name: "Students", icon: Users },
    { name: "Classes", icon: Calendar },
    { name: "Subscriptions", icon: Calendar },
  ]

  return (
    <AuthGuard mode="requiredAuth">
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left Panel: Form */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-center">
              Create Your Workspace
            </h2>
            <p className="text-center text-gray-600 mb-6">
              You don’t have any workspaces yet. Start by choosing a name below.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "At least 3 characters",
                    },
                  })}
                  placeholder="e.g. Marketing Team"
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : "Create Workspace"}
              </Button>
            </form>
          </div>
        </div>

        {/* Right Panel: Fixed‐Size “Screen” with Sidebar + Dashboard */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-8">
          <div className="relative h-[360px] w-[640px] bg-black rounded-lg shadow-xl overflow-visible">
            {/* Bezel */}
            <div className="absolute inset-0 border-4 border-gray-800 rounded-lg pointer-events-none" />

            {/* Inner Dashboard */}
            <div className="absolute top-4 left-4 w-[calc(100%_-_32px)] h-[calc(100%_-_32px)] bg-white rounded-md shadow-md overflow-hidden">
              <div className="flex h-full">
                {/* Sidebar */}
                {/* <div className="w-16 flex-shrink-0 flex flex-col bg-gray-50 border-r">
                  <div className="h-16 flex items-center justify-center px-2 border-b text-center">
                    <span className="text-[10px] font-semibold truncate">
                      {workspaceName}
                    </span>
                  </div>
                  <nav className="flex-1 flex flex-col items-center space-y-4 py-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        className="flex flex-col items-center text-gray-600 hover:text-gray-900"
                      >
                        <item.icon className="h-5 w-5 mb-1" />
                        <span className="text-[9px] truncate">{item.name}</span>
                      </button>
                    ))}
                  </nav>
                </div> */}
                <Sidebar />


                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  {/* Header + Breadcrumb */}
                  {/* <div className="border-b">
                    <div className="px-3 py-1 text-xs text-gray-500">Home</div>
                    <div className="px-3 py-2">
                      <h2 className="text-xl font-bold">Dashboard</h2>
                    </div>
                  </div> */}

                  {/* Content */}
                  {/* <div className="p-2 space-y-2 overflow-y-auto h-[calc(100%_-_48px)]"> */}
                  {/* Stat Cards Grid */}
                  {/* <div className="grid gap-1 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {statCards.map((card) => (
                        <Card key={card.title} className="shadow-none border">
                          <CardHeader className="flex items-center justify-between pb-1 px-2">
                            <CardTitle className="text-[10px] font-medium">
                              {card.title}
                            </CardTitle>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                          </CardHeader>
                          <CardContent className="px-2">
                            <div className="text-lg font-bold">{card.value}</div>
                            <p className="text-[9px] text-gray-500">
                              {card.description}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div> */}

                  {/* Recent Activity */}
                  {/* <Card className="mt-1 mx-1">
                      <CardHeader>
                        <CardTitle className="text-sm">Recent Activity</CardTitle>
                        <CardDescription className="text-[10px] text-gray-500">
                          Latest actions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                            <div>
                              <p className="text-[9px] font-medium truncate">
                                New student “Alice” signed up
                              </p>
                              <p className="text-[8px] text-gray-500">10m ago</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                            <div>
                              <p className="text-[9px] font-medium truncate">
                                Class “Yoga Basics” created
                              </p>
                              <p className="text-[8px] text-gray-500">1h ago</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                            <div>
                              <p className="text-[9px] font-medium truncate">
                                Payment $150 received
                              </p>
                              <p className="text-[8px] text-gray-500">Yesterday</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="mt-1 mx-1">
                      <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                        <CardDescription className="text-[10px] text-gray-500">
                          Common tasks
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-1">
                        <button className="w-full text-left p-1 bg-gray-100 rounded hover:bg-gray-200 transition">
                          <div className="text-[9px] font-medium">
                            Add New Student
                          </div>
                          <div className="text-[8px] text-gray-500">
                            Register a student
                          </div>
                        </button>
                        <button className="w-full text-left p-1 bg-gray-100 rounded hover:bg-gray-200 transition">
                          <div className="text-[9px] font-medium">Schedule Class</div>
                          <div className="text-[8px] text-gray-500">
                            Create a new class
                          </div>
                        </button>
                        <button className="w-full text-left p-1 bg-gray-100 rounded hover:bg-gray-200 transition">
                          <div className="text-[9px] font-medium">View Reports</div>
                          <div className="text-[8px] text-gray-500">
                            Check analytics
                          </div>
                        </button>
                      </CardContent>
                    </Card> */}
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
}
