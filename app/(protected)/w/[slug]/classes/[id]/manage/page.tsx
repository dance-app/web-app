'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Users,
  UserCheck,
  UserX,
  ArrowLeft,
  Download,
  Filter,
  Mail,
} from 'lucide-react';
import { Breadcrumbs, type BreadcrumbItem } from '@/components/breadcrumbs';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Spinner } from '@/components/ui/spinner';
import { DanceRoleTag } from '@/components/ui/dance-role-tag';
import { ParticipationTag } from '@/components/ui/participation-tag';
import Link from 'next/link';

// Mock event data - replace with actual API call
const mockEvent = {
  id: '1',
  title: 'Beginner Salsa Class',
  description: 'Perfect for those just starting their salsa journey',
  danceTypeId: '1',
  danceType: {
    id: '1',
    name: 'Salsa',
    description: 'Cuban-style salsa',
    workspaceId: '1',
  },
  startTime: '2024-02-15T19:00:00Z',
  endTime: '2024-02-15T20:30:00Z',
  maxParticipants: 20,
  workspaceId: '1',
  participations: [
    {
      id: '1',
      studentId: '1',
      eventId: '1',
      status: 'present' as const,
      registeredAt: '2024-02-10T10:00:00Z',
      attendedAt: '2024-02-15T19:00:00Z',
      student: {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        preferedDanceRole: 'LEADER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
        roles: [],
      },
    },
    {
      id: '2',
      studentId: '2',
      eventId: '1',
      status: 'registered' as const,
      registeredAt: '2024-02-10T11:00:00Z',
      student: {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        preferedDanceRole: 'FOLLOWER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
        roles: [],
      },
    },
    {
      id: '3',
      studentId: '3',
      eventId: '1',
      status: 'absent' as const,
      registeredAt: '2024-02-09T15:00:00Z',
      student: {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        preferedDanceRole: 'LEADER' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: '1',
        roles: [],
      },
    },
  ],
  createdAt: '2024-02-01T00:00:00Z',
  updatedAt: '2024-02-01T00:00:00Z',
};

export default function EventParticipationsPage() {
  const params = useParams();
  const eventId = params.id as string;
  const { workspace } = useCurrentWorkspace();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // In real app, fetch event data based on eventId
  const event = mockEvent;
  const isLoading = false;

  const breadcrumbItems = useMemo<BreadcrumbItem[]>(() => {
    if (!workspace?.slug) return [{ label: 'Manage Participants' }];
    return [
      { label: 'Classes', href: `/w/${workspace.slug}/classes` },
      { label: event.title, href: `/w/${workspace.slug}/classes/${eventId}` },
      { label: 'Manage Participants' },
    ];
  }, [workspace?.slug, event.title, eventId]);

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Breadcrumbs title="Manage Participants" />
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  const participations = event.participations || [];
  const registeredCount = participations.filter(
    (p) => p.status === 'registered'
  ).length;
  const presentCount = participations.filter(
    (p) => p.status === 'present'
  ).length;
  const absentCount = participations.filter(
    (p) => p.status === 'absent'
  ).length;

  // Filter participations based on search and filters
  const filteredParticipations = participations.filter((participation) => {
    const matchesSearch = participation.student?.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || participation.status === statusFilter;
    const matchesRole =
      roleFilter === 'all' ||
      participation.student?.preferedDanceRole === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const updateParticipationStatus = (
    participationId: string,
    status: 'registered' | 'present' | 'absent' | 'invited'
  ) => {
    // TODO: Implement with API call
    console.log('Update participation:', participationId, status);
  };

  const bulkMarkPresent = () => {
    // TODO: Implement bulk mark as present
    console.log('Bulk mark present');
  };

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <div className="flex items-center gap-4">
          <Breadcrumbs items={breadcrumbItems} />
        </div>
        <div className="flex gap-2">
          <Button onClick={bulkMarkPresent}>
            <UserCheck className="h-4 w-4 mr-2" />
            Mark All Present
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-8 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">
                  {participations.length}
                </div>
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
                <div className="text-2xl font-bold text-orange-600">
                  {registeredCount}
                </div>
                <div className="text-xs text-muted-foreground">Registered</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  {absentCount}
                </div>
                <div className="text-xs text-muted-foreground">Absent</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search participants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="invited">Invited</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="LEADER">Leaders</SelectItem>
                    <SelectItem value="FOLLOWER">Followers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Participants List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Participants ({filteredParticipations.length})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredParticipations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchTerm ||
                    statusFilter !== 'all' ||
                    roleFilter !== 'all'
                      ? 'No participants match the current filters'
                      : 'No participants yet'}
                  </div>
                ) : (
                  filteredParticipations.map((participation) => (
                    <div
                      key={participation.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {participation.student?.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium">
                            {participation.student?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {participation.student?.email}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DanceRoleTag
                            role={participation.student?.preferedDanceRole}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <ParticipationTag
                          status={participation.status}
                          className="min-w-[100px]"
                        />

                        <Select
                          value={participation.status}
                          onValueChange={(
                            value:
                              | 'registered'
                              | 'present'
                              | 'absent'
                              | 'invited'
                          ) =>
                            updateParticipationStatus(participation.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="invited">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Invited
                              </div>
                            </SelectItem>
                            <SelectItem value="registered">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Registered
                              </div>
                            </SelectItem>
                            <SelectItem value="present">
                              <div className="flex items-center gap-2">
                                <UserCheck className="h-4 w-4" />
                                Present
                              </div>
                            </SelectItem>
                            <SelectItem value="absent">
                              <div className="flex items-center gap-2">
                                <UserX className="h-4 w-4" />
                                Absent
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="flex justify-center gap-4">
            <Link href="../">
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Event Details
              </Button>
            </Link>
            <Button
              onClick={() => {
                /* TODO: Save changes */
              }}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
