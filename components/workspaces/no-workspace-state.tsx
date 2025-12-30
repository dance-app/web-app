'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Sidebar } from '../layout/sidebar';
import { WeekStart } from '@/types';
import { useWorkspaceCreate } from '@/hooks/use-workspace-create';
import { toast } from 'sonner';

interface CreateWorkspaceForm {
  name: string;
}

export default function NoWorkspaceState() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const { create, isPending } = useWorkspaceCreate({
    onSuccess: (workspace) => {
      toast.success('Workspace created successfully!');
      router.push(`/w/${workspace.slug}`);
    },
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateWorkspaceForm>({
    defaultValues: { name: '' },
    mode: 'onChange',
  });

  const workspaceName = watch('name') || 'Your Workspace';

  const onSubmit = async (data: CreateWorkspaceForm) => {
    try {
      setError(null);
      await create({
        name: data.name.trim(),
      });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create workspace';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-2/3 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md">
          <h2 className="text-3xl font-bold mb-4">Create your workspace</h2>
          <p className="text-gray-600 mb-6">
            You don’t have any workspaces yet. Start by choosing a name below.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Workspace name</Label>
              <Input
                id="name"
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  minLength: {
                    value: 3,
                    message: 'At least 3 characters',
                  },
                })}
                placeholder="e.g. Dance Studio Pro"
                disabled={isPending}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? <Spinner /> : 'Create Workspace'}
            </Button>
          </form>
        </div>
      </div>

      <div className="hidden md:w-1/3 md:flex relative items-center justify-center bg-gray-100">
        <div className="absolute h-4/5 w-[800px] left-12 bg-black rounded-lg shadow-xl overflow-visible">
          <div className="absolute top-2 left-2 w-[calc(100%_-_16px)] h-[calc(100%_-_16px)] bg-white rounded-md shadow-md overflow-hidden">
            <div className="flex h-full pointer-events-none" inert>
              <Sidebar
                fakeWorkspace={{
                  createdAt: new Date().toISOString(),
                  id: 'fake-workspace-id',
                  name: workspaceName,
                  createdById: 'fake-user-id',
                  slug: 'fake-workspace-slug',
                  updatedAt: new Date().toISOString(),
                  configuration: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    id: 'fake-configuration-id',
                    weekStart: WeekStart.MONDAY,
                    danceTypes: []
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
