'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Plus, DollarSign } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { PageLayout } from '@/components/page-layout';

export default function SubscriptionsPage() {
  return (
    <PageLayout
      header={
        <>
          <Breadcrumbs title="Subscriptions" />
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Package
            </Button>
          </div>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Basic Package
            </CardTitle>
            <CardDescription>Perfect for beginners</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Classes</span>
                <span className="font-medium">8 classes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">$120</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Validity</span>
                <span className="font-medium">2 months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant="default">12 students</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Premium Package
            </CardTitle>
            <CardDescription>For dedicated dancers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Classes</span>
                <span className="font-medium">16 classes</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="font-medium">$200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Validity</span>
                <span className="font-medium">3 months</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active</span>
                <Badge variant="default">8 students</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Monthly Revenue
            </CardTitle>
            <CardDescription>This month's earnings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2,840</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
