'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Student } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  Calendar,
  Mail,
  User,
  CreditCard,
  Clock,
  Plus,
  Trash2,
} from 'lucide-react';

export interface DanceType {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
}

interface StudentDetailDrawerProps {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  danceTypes: DanceType[];
  onSubmit: (
    data: Partial<Student>
  ) => Promise<{ success: boolean; error?: string }>;
}

export function StudentDetailDrawer({
  student,
  open,
  onOpenChange,
  danceTypes,
  onSubmit,
}: StudentDetailDrawerProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    danceRole: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  // Reset form data when student changes
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        email: student.email,
        phone: '',
        danceRole: '',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        danceRole: '',
      });
    }
    setError('');
  }, [student, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await onSubmit(formData);

    if (result.success) {
      // Keep the drawer open after successful submission
    } else {
      setError(result.error || 'Failed to save student');
    }

    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!student) return null;

  const getHighestLevel = () => {
    const levels = ['beginner', 'intermediate', 'advanced', 'professional'];
    let highest = -1;

    // student.levels.forEach((level) => {
    //   const index = levels.indexOf(level.level);
    //   if (index > highest) {
    //     highest = index;
    //   }
    // });

    return highest >= 0 ? levels[highest] : 'none';
  };

  const getSubscriptionProgress = () => {
    // if (!student.subscription) return 0;
    // const { classesRemaining, totalClasses } = student.subscription;
    // return ((totalClasses - classesRemaining) / totalClasses) * 100;
    return 90;
  };

  const formatDanceRole = (role: string | null) => {
    if (!role) return 'Not specified';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent size='xl' className='overflow-y-auto'>
        <SheetHeader className='space-y-2 pr-10'>
          <div className='flex items-center gap-4'>
            <Avatar className='h-16 w-16'>
              <AvatarImage
                src={student.avatar || '/placeholder.svg'}
                alt={student.name}
              />
              <AvatarFallback>
                {student.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <SheetTitle className='text-2xl'>{student.name}</SheetTitle>
              <SheetDescription className='flex items-center gap-2'>
                <Mail className='h-4 w-4' />
                {student.email}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className='mt-6'>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-3'>
              <TabsTrigger value='details'>Details</TabsTrigger>
              <TabsTrigger value='levels'>Dance Levels</TabsTrigger>
              <TabsTrigger value='subscription'>Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value='details' className='mt-4 space-y-4'>
              <form onSubmit={handleSubmit}>
                {error && (
                  <Alert variant='destructive' className='mb-4'>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className='grid gap-4'>
                  <div className='grid gap-2'>
                    <Label htmlFor='name'>Full Name</Label>
                    <Input
                      id='name'
                      name='name'
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='Full Name'
                      required
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      value={formData.email}
                      onChange={handleChange}
                      placeholder='Email Address'
                      required
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='phone'>Phone Number</Label>
                    <Input
                      id='phone'
                      name='phone'
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='Phone Number'
                    />
                  </div>

                  <div className='grid gap-2'>
                    <Label htmlFor='danceRole'>Dance Role</Label>
                    <Select
                      value={formData.danceRole}
                      onValueChange={(value) =>
                        handleSelectChange('danceRole', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select a role' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='leader'>Leader</SelectItem>
                        <SelectItem value='follower'>Follower</SelectItem>
                        <SelectItem value='both'>Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='mt-6 space-y-4'>
                  <h3 className='text-lg font-medium'>
                    Additional Information
                  </h3>
                  <Separator />

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-1'>
                      <p className='text-sm text-muted-foreground'>
                        Member Since
                      </p>
                      <p className='flex items-center gap-2'>
                        <Calendar className='h-4 w-4' />
                        {format(new Date(student.createdAt), 'PPP')}
                      </p>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm text-muted-foreground'>
                        Dance Role
                      </p>
                      <p className='flex items-center gap-2'>
                        <User className='h-4 w-4' />
                        {/* {formatDanceRole(student.danceRole)} */}
                        {formatDanceRole(null)}
                      </p>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm text-muted-foreground'>
                        Highest Level
                      </p>
                      <Badge>{getHighestLevel()}</Badge>
                    </div>

                    <div className='space-y-1'>
                      <p className='text-sm text-muted-foreground'>
                        Dance Types
                      </p>
                      <div className='flex flex-wrap gap-1'>
                        {/* {student.levels.map((level) => ( */}
                        <Badge variant='outline'>
                          {/* <Badge key={level.id} variant='outline'> */}
                          Test
                          {/* {level.danceType.name} */}
                        </Badge>
                        {/* ))} */}
                      </div>
                    </div>
                  </div>
                </div>

                <SheetFooter className='mt-6'>
                  <Button type='submit' disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </SheetFooter>
              </form>
            </TabsContent>

            <TabsContent value='levels' className='mt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Dance Levels</h3>
                <Button size='sm' variant='outline'>
                  <Plus className='mr-2 h-4 w-4' />
                  Add Level
                </Button>
              </div>

              <Separator />

              {/* {student.levels.length === 0 ? ( */}
              {[].length === 0 ? (
                <div className='text-center py-8'>
                  <User className='mx-auto h-12 w-12 text-muted-foreground' />
                  <h3 className='mt-4 text-lg font-semibold'>
                    No dance levels
                  </h3>
                  <p className='text-muted-foreground'>
                    This student doesn't have any dance levels yet.
                  </p>
                  <Button className='mt-4' variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add First Level
                  </Button>
                </div>
              ) : (
                <div className='space-y-4'>
                  {/* {student.levels.map((level) => ( */}
                  {[{ id: 1, level: "1", updatedAt: '', danceType: { name: "Salsa" } }].map((level) => (
                    <Card key={level.id}>
                      <CardHeader className='pb-2'>
                        <div className='flex items-center justify-between'>
                          <CardTitle>{level.danceType.name}</CardTitle>
                          <Badge>{level.level}</Badge>
                        </div>
                        <CardDescription>
                          Last updated:{' '}
                          {format(new Date(level.updatedAt), 'PPP')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className='flex items-center justify-between'>
                          <Select defaultValue={level.level}>
                            <SelectTrigger className='w-[180px]'>
                              <SelectValue placeholder='Select level' />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value='beginner'>Beginner</SelectItem>
                              <SelectItem value='intermediate'>
                                Intermediate
                              </SelectItem>
                              <SelectItem value='advanced'>Advanced</SelectItem>
                              <SelectItem value='professional'>
                                Professional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-destructive'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value='subscription' className='mt-4 space-y-4'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-medium'>Subscription Details</h3>
                {/* {!student.subscription && (
                  <Button size='sm' variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Subscription
                  </Button>
                )} */}
              </div>

              <Separator />

              {/* {!student.subscription ? ( */}
              {true ? (
                <div className='text-center py-8'>
                  <CreditCard className='mx-auto h-12 w-12 text-muted-foreground' />
                  <h3 className='mt-4 text-lg font-semibold'>
                    No active subscription
                  </h3>
                  <p className='text-muted-foreground'>
                    This student doesn't have an active subscription.
                  </p>
                  <Button className='mt-4' variant='outline'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Subscription
                  </Button>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle>
                        {/* {student.subscription.totalClasses} Class Package */}
                        Class Package
                      </CardTitle>
                      <Badge
                        variant={
                          // student.subscription.isActive
                          //   ? 'default'
                          //   : 'secondary'
                          'secondary'
                        }
                      >
                        {/* {student.subscription.isActive ? 'Active' : 'Inactive'} */}
                        Active
                      </Badge>
                    </div>
                    <CardDescription>
                      Created on{' '}
                      {/* {format(new Date(student.subscription.createdAt), 'PPP')} */}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div className='space-y-2'>
                      <div className='flex items-center justify-between text-sm'>
                        <span>Classes Used</span>
                        <span>
                          19/20
                          {/* {student.subscription.totalClasses -
                            student.subscription.classesRemaining}{' '}
                          / {student.subscription.totalClasses} */}
                        </span>
                      </div>
                      <Progress
                        value={getSubscriptionProgress()}
                        className='h-2'
                      />
                    </div>

                    <div className='grid grid-cols-2 gap-4'>
                      <div className='space-y-1'>
                        <p className='text-sm text-muted-foreground'>
                          Classes Remaining
                        </p>
                        <p className='font-medium'>
                          {/* {student.subscription.classesRemaining} classes */}
                          1 classes
                        </p>
                      </div>

                      <div className='space-y-1'>
                        <p className='text-sm text-muted-foreground'>
                          Expires On
                        </p>
                        <p className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          {/* {student.subscription.expiresAt
                            ? format(
                              new Date(student.subscription.expiresAt),
                              'PPP'
                            )
                            : 'Never'} */}
                          Never
                        </p>
                      </div>
                    </div>

                    <div className='flex gap-2 pt-4'>
                      <Button variant='outline' className='flex-1'>
                        Renew Subscription
                      </Button>
                      <Button variant='outline' className='flex-1'>
                        Add Classes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  )
}
