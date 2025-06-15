'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { format } from 'date-fns';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  ExternalLink,
  User,
  UserCheck,
  UserX,
} from 'lucide-react';
import type { Event } from '@/types';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { useRouter } from 'next/navigation';

interface EventDetailsModalProps {
  children: React.ReactNode;
  event: Event;
}

export function EventDetailsModal({ children, event }: EventDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const { workspace } = useCurrentWorkspace();
  const router = useRouter();

  const participations = event.participations || [];
  const totalParticipants = participations.length;
  const presentCount = participations.filter(
    (p) => p.status === 'present'
  ).length;
  const registeredCount = participations.filter(
    (p) => p.status === 'registered'
  ).length;
  const absentCount = participations.filter(
    (p) => p.status === 'absent'
  ).length;

  // Calculate leader/follower balance
  const leaderCount = participations.filter(
    (p) => p.member?.preferedDanceRole === 'LEADER'
  ).length;
  const followerCount = participations.filter(
    (p) => p.member?.preferedDanceRole === 'FOLLOWER'
  ).length;
  const noRoleCount = participations.filter(
    (p) => !p.member?.preferedDanceRole || p.member?.preferedDanceRole === null
  ).length;

  // Participation status data for pie chart
  const statusData = [
    { name: 'Present', value: presentCount, color: '#10b981' },
    { name: 'Registered', value: registeredCount, color: '#f59e0b' },
    { name: 'Absent', value: absentCount, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  // Role balance data for donut chart
  const roleData = [
    { name: 'Leaders', value: leaderCount, color: '#3b82f6' },
    { name: 'Followers', value: followerCount, color: '#ec4899' },
    { name: 'No Role Set', value: noRoleCount, color: '#6b7280' },
  ].filter((item) => item.value > 0);

  const completionRate =
    totalParticipants > 0 ? (presentCount / totalParticipants) * 100 : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="font-medium">
            {data.name}: {data.value}
          </p>
          <p className="text-sm text-muted-foreground">
            {((data.value / totalParticipants) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Event Details - {event.title}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                router.push(`/w/${workspace?.slug}/classes/${event.id}`);
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Screen
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                  <div className="font-medium">
                    {format(new Date(event.startTime), 'PPP')}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Time
                  </div>
                  <div className="font-medium">
                    {format(new Date(event.startTime), 'p')} -{' '}
                    {format(new Date(event.endTime), 'p')}
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
                  <div className="text-sm text-muted-foreground">
                    Dance Type
                  </div>
                  <Badge variant="outline">{event.danceType.name}</Badge>
                </div>
              </div>

              {event.description && (
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Description
                  </div>
                  <p className="text-sm">{event.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participation Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Attendance Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Attendance Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Completion Rate
                    </span>
                    <span className="font-medium">
                      {completionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>

                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
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
                  <div className="text-center py-8 text-muted-foreground">
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
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">
                      Balance Score
                    </span>
                    <span className="font-medium">
                      {totalParticipants > 0
                        ? `${Math.min(leaderCount, followerCount)}/${Math.max(
                            leaderCount,
                            followerCount
                          )}`
                        : 'N/A'}
                    </span>
                  </div>
                  {leaderCount > 0 && followerCount > 0 && (
                    <div className="grid grid-cols-2 gap-1">
                      <div className="bg-blue-500 h-2 rounded-l-full" />
                      <div className="bg-pink-500 h-2 rounded-r-full" />
                    </div>
                  )}
                </div>

                {roleData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={roleData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
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
                  <div className="text-center py-8 text-muted-foreground">
                    No role data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{totalParticipants}</div>
                <div className="text-xs text-muted-foreground">
                  Total Registered
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {presentCount}
                </div>
                <div className="text-xs text-muted-foreground">Present</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {leaderCount}
                </div>
                <div className="text-xs text-muted-foreground">Leaders</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-pink-600">
                  {followerCount}
                </div>
                <div className="text-xs text-muted-foreground">Followers</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
