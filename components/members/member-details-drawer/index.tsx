'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { Member } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { MemberDetailsForm } from './member-details-form';

interface MemberDetailDrawerProps {
  member: Member | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // danceTypes: DanceType[];
  onSubmit: (
    data: Partial<Member>
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete?: (memberId: string) => void;
}

export function MemberDetailDrawer({
  member,
  open,
  onOpenChange,
  // danceTypes,
  onSubmit,
  onDelete,
}: MemberDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState('details');

  if (!member) return null;

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent size="xl" className="overflow-y-auto flex flex-col">
          <SheetHeader className="space-y-2 pr-10">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 bg-gray-100">
                <AvatarFallback className='text-2xl'>
                  {(member.name || member.user?.firstName || 'U')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <SheetTitle className="text-2xl">{member.name || (member.user ? `${member.user.firstName} ${member.user.lastName}` : 'Unnamed Member')}</SheetTitle>
                <SheetDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </SheetDescription>
              </div>
            </div>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className='flex flex-col flex-1 gap-4'>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="levels">Dance Levels</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="flex flex-1 mt-0">
              <MemberDetailsForm member={member} onDelete={onDelete} />
            </TabsContent>

            {/* <TabsContent value="levels" className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Dance Levels</h3>
                <Button size="sm" variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Level
                </Button>
              </div>

              <Separator />

              {[].length === 0 ? (
                <div className="text-center py-8">
                  <User className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">
                    No dance levels
                  </h3>
                  <p className="text-muted-foreground">
                    This student doesn't have any dance levels yet.
                  </p>
                  <Button className="mt-4" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Level
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      level: '1',
                      updatedAt: '',
                      danceType: { name: 'Salsa' },
                    },
                  ].map((level) => (
                    <Card key={level.id}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle>{level.danceType.name}</CardTitle>
                          <Badge>{level.level}</Badge>
                        </div>
                        <CardDescription>
                          Last updated:{' '}
                          {format(new Date(level.updatedAt), 'PPP')}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <Select defaultValue={level.level}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                              <SelectItem value="professional">
                                Professional
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent> */}

          </Tabs>

        </SheetContent>
      </Sheet>
    </>
  );
}


//  <TabsContent value="subscription" className="mt-6 space-y-4">
//               <div className="flex items-center justify-between">
//                 <h3 className="text-lg font-medium">Subscription Details</h3>
//                 {/* {!student.subscription && (
//                   <Button size='sm' variant='outline'>
//                     <Plus className='mr-2 h-4 w-4' />
//                     Add Subscription
//                   </Button>
//                 )} */}
//               </div>

//               <Separator />

//               {/* {!student.subscription ? ( */}
//               {true ? (
//                 <div className="text-center py-8">
//                   <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
//                   <h3 className="mt-4 text-lg font-semibold">
//                     No active subscription
//                   </h3>
//                   <p className="text-muted-foreground">
//                     This student doesn't have an active subscription.
//                   </p>
//                   <Button className="mt-4" variant="outline">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Add Subscription
//                   </Button>
//                 </div>
//               ) : (
//                 <Card>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <CardTitle>
//                         {/* {student.subscription.totalClasses} Class Package */}
//                         Class Package
//                       </CardTitle>
//                       <Badge
//                         variant={
//                           // student.subscription.isActive
//                           //   ? 'default'
//                           //   : 'secondary'
//                           'secondary'
//                         }
//                       >
//                         {/* {student.subscription.isActive ? 'Active' : 'Inactive'} */}
//                         Active
//                       </Badge>
//                     </div>
//                     <CardDescription>
//                       Created on{' '}
//                       {/* {format(new Date(student.subscription.createdAt), 'PPP')} */}
//                     </CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between text-sm">
//                         <span>Classes Used</span>
//                         <span>
//                           19/20
//                           {/* {student.subscription.totalClasses -
//                             student.subscription.classesRemaining}{' '}
//                           / {student.subscription.totalClasses} */}
//                         </span>
//                       </div>
//                       <Progress
//                         value={getSubscriptionProgress()}
//                         className="h-2"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-1">
//                         <p className="text-sm text-muted-foreground">
//                           Classes Remaining
//                         </p>
//                         <p className="font-medium">
//                           {/* {student.subscription.classesRemaining} classes */}
//                           1 classes
//                         </p>
//                       </div>

//                       <div className="space-y-1">
//                         <p className="text-sm text-muted-foreground">
//                           Expires On
//                         </p>
//                         <p className="flex items-center gap-2">
//                           <Clock className="h-4 w-4" />
//                           {/* {student.subscription.expiresAt
//                             ? format(
//                               new Date(student.subscription.expiresAt),
//                               'PPP'
//                             )
//                             : 'Never'} */}
//                           Never
//                         </p>
//                       </div>
//                     </div>

//                     <div className="flex gap-2 pt-4">
//                       <Button variant="outline" className="flex-1">
//                         Renew Subscription
//                       </Button>
//                       <Button variant="outline" className="flex-1">
//                         Add Classes
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               )}
//             </TabsContent>
