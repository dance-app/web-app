'use client';

import { PageLayout } from '@/components/page-layout';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCurrentWorkspace } from '@/hooks/use-current-workspace';
import { Spinner } from '@/components/ui/spinner';

export default function WorkspaceSettingsPage() {
  const { workspace, isLoading } = useCurrentWorkspace();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner />
      </div>
    );
  }

  if (!workspace) {
    return null;
  }

  return (
    <PageLayout header={<Breadcrumbs title="Settings" />}>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Workspace Settings</h2>
          <p className="text-muted-foreground">
            Manage your workspace configuration and preferences
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>General</CardTitle>
            <CardDescription>
              Basic information about your workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                defaultValue={workspace.name}
                placeholder="Enter workspace name"
                disabled
              />
              <p className="text-sm text-muted-foreground">
                The name of your workspace as it appears throughout the app
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workspace-slug">Workspace Slug</Label>
              <Input
                id="workspace-slug"
                defaultValue={workspace.slug}
                placeholder="workspace-slug"
                disabled
              />
              <p className="text-sm text-muted-foreground">
                Used in URLs to identify your workspace
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button disabled>Save Changes</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions for your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Once you delete a workspace, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" disabled>
                Delete Workspace
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
