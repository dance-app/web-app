"use client"

import { useParams } from "next/navigation"
import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { format } from "date-fns"
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  User,
  UserCheck,
} from "lucide-react"
import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs"
import { useCurrentWorkspace } from "@/hooks/use-current-workspace"
import { Spinner } from "@/components/ui/spinner"
import Link from "next/link"
import type { Event, Participation } from "@/types"

// Mock event data - replace with actual API call
const mockEvent: Event = {
  id: '1',
  title: 'Beginner Salsa Class',
  description: 'Perfect for those just starting their salsa journey',
  danceTypeId: '1',
  danceType: { id: '1', name: 'Salsa', description: 'Cuban-style salsa', workspaceId: '1' },
  startTime: '2024-02-15T19:00:00Z',
  endTime: '2024-02-15T20:30:00Z',
  maxParticipants: 20,
  workspaceId: '1',
  participations: [
    {
      id: '1',
      memberId: '1',
      eventId: '1',
      status: 'present' as const,
      registeredAt: '2024-02-10T10:00:00Z',
      attendedAt: '2024-02-15T19:00:00Z',
      member: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
        roles: [],
        user: {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          accounts: [],
          isSuperAdmin: false,
          createdAt: new Date().toISOString(),
        }
      }
    },
    {
      id: '2',
      memberId: '2',
      eventId: '1',
      status: 'registered' as const,
      registeredAt: '2024-02-10T11:00:00Z',
      member: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
        roles: [],
        user: {
          id: '2',
          firstName: 'Jane',
          lastName: 'Smith',
          accounts: [],
          isSuperAdmin: false,
          createdAt: new Date().toISOString(),
        }
      }
    }
  ],
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
}

export default function EventDetailsPage() {
  const params = useParams()
  const eventId = params.id as string
  const { workspace } = useCurrentWorkspace()

  // In real app, fetch event data based on eventId
  const event = mockEvent
  const isLoading = false

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (!workspace?.slug) return [{ label: event.title }];
    return [
      { label: "Classes", href: `/w/${workspace.slug}/classes` },
      { label: event.title }
    ];
  }, [workspace?.slug, event.title])

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Breadcrumbs title="Event Details" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    )
  }

  const participations = event.participations || []
  const totalParticipants = participations.length
  const presentCount = participations.filter(p => p.status === 'present').length
  const registeredCount = participations.filter(p => p.status === 'registered').length
  const absentCount = participations.filter(p => p.status === 'absent').length

  // Calculate leader/follower balance
  const leaderCount = participations.filter(p =>
    p.member?.preferedDanceRole === 'LEADER'
  ).length
  const followerCount = participations.filter(p =>
    p.member?.preferedDanceRole === 'FOLLOWER'
  ).length
  const noRoleCount = participations.filter(p =>
    !p.member?.preferedDanceRole || p.member?.preferedDanceRole === null
  ).length

  // Participation status data for pie chart
  const statusData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Registered', value: registeredCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ].filter(item => item.value > 0)

  // Role balance data for donut chart
  const roleData = [
    { name: 'Leaders', value: leaderCount, color: '#3b82f6' },
    { name: 'Followers', value: followerCount, color: '#ec4899' },
    { name: 'No Role Set', value: noRoleCount, color: '#6b7280' },
  ].filter(item => item.value > 0)

  const completionRate = totalParticipants > 0 ? (presentCount / totalParticipants) * 100 : 0

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">{data.name}: {data.value}</p>
          <p className="text-sm text-muted-foreground">
            {((data.value / totalParticipants) * 100).toFixed(1)}%
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-4">
          {/* <Link href="../">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Classes
            </Button>
          </Link> */}
          <Breadcrumbs items={breadcrumbItems} />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <div className="font-medium">
                    {format(new Date(event.startTime), "PPP")}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                  <div className="font-medium">
                    {format(new Date(event.startTime), "p")} - {format(new Date(event.endTime), "p")}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    Capacity
                  </div>
                  <div className="font-medium">
                    {totalParticipants} / {event.maxParticipants || 'Unlimited'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Dance Type</div>
                  <Badge variant="outline">{event.danceType.name}</Badge>
                </div>
              </div>

              {event.description && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Description</div>
                  <p className="text-sm">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Attendance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Completion Rate</span>
                    <span className="font-medium">{completionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No participants yet
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role Balance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Role Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Balance Score</span>
                    <span className="font-medium">
                      {totalParticipants > 0 ?
                        `${Math.min(leaderCount, followerCount)}/${Math.max(leaderCount, followerCount)}` :
                        'N/A'
                      }
                    </span>
                  </div>
                  {leaderCount > 0 && followerCount > 0 && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-blue-500 h-3 rounded-l-full" />
                      <div className="bg-pink-500 h-3 rounded-r-full" />
                    </div>
                  )}
                </div>

                {roleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        outerRadius={120}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {roleData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    No role data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <div className="text-xs text-muted-foreground">Total Registered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <div className="text-xs text-muted-foreground">Present</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{registeredCount}</div>
                <div className="text-xs text-muted-foreground">Registered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{leaderCount}</div>
                <div className="text-xs text-muted-foreground">Leaders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">{followerCount}</div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Link href={`${eventId}/manage`}>
              <Button>
                <Users className="h-4 w-4 mr-2" />
                Manage Participants
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
