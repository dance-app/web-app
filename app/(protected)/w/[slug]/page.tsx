'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Users,
  Calendar,
  CreditCard,
  TrendingUp,
  DollarSign,
  UserCheck,
} from 'lucide-react';
import { useDashboard } from '@/hooks/use-dashboard';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Spinner } from '@/components/ui/spinner';
import { getTimeGreeting } from '@/lib/utils';
import { PageLayout } from '@/components/page-layout';
import { useCurrentUser } from '@/hooks/use-current-user';

export default function DashboardPage() {
  const { stats, loading } = useDashboard();
  const { user, isLoading: userLoading } = useCurrentUser();

  if (loading || userLoading) return <Spinner />;

  const statCards = [
    {
      title: 'Total Students',
      value: stats?.totalStudents || 0,
      description: 'Active students in your school',
      icon: Users,
      color: 'text-blue-600',
    },
    {
      title: 'Total Classes',
      value: stats?.totalEvents || 0,
      description: 'Classes scheduled this month',
      icon: Calendar,
      color: 'text-green-600',
    },
    {
      title: 'Active Subscriptions',
      value: stats?.activeSubscriptions || 0,
      description: 'Students with active subscriptions',
      icon: CreditCard,
      color: 'text-purple-600',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats?.revenueThisMonth || 0}`,
      description: 'Revenue generated this month',
      icon: DollarSign,
      color: 'text-green-600',
    },
    {
      title: 'Attendance Rate',
      value: `${stats?.attendanceRate || 0}%`,
      description: 'Average attendance rate',
      icon: UserCheck,
      color: 'text-orange-600',
    },
    {
      title: 'Total Participations',
      value: stats?.totalParticipations || 0,
      description: 'Total class participations',
      icon: TrendingUp,
      color: 'text-indigo-600',
    },
  ];

  return (
    <PageLayout header={<Breadcrumbs title="Home" />}>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          {getTimeGreeting()}, {user?.firstName} 👋
        </h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest activities in your salsa school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New student registered
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Class completed successfully
                  </p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Subscription renewed</p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for your school</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
              <div className="font-medium">Add New Student</div>
              <div className="text-sm text-muted-foreground">
                Register a new student
              </div>
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
              <div className="font-medium">Schedule Class</div>
              <div className="text-sm text-muted-foreground">
                Create a new class
              </div>
            </button>
            <button className="w-full text-left p-2 rounded hover:bg-gray-100 transition-colors">
              <div className="font-medium">View Reports</div>
              <div className="text-sm text-muted-foreground">
                Check analytics
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
