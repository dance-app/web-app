'use client';

import { useState } from 'react';
import { useEvents } from '@/hooks/use-events';
import { CalendarView } from '@/components/classes/calendar-view';
import { ListView } from '@/components/classes/list-view';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EventCreateModal } from '@/components/events/event-create-modal';
// import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Plus, List, Calendar, Search } from 'lucide-react';
import type { Event } from '@/types';
// import { DateRange } from "react-day-picker"
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
import { PageLayout } from '@/components/page-layout';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type ViewMode = 'list' | 'calendar';

const ClassesSkeleton = () => (
  <div className="space-y-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-9 w-20" />
            </div>
          </div>
          <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center space-x-1">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-12" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default function ClassesPage() {
  const { events, danceTypes, isLoading } = useEvents();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [searchTerm, setSearchTerm] = useState('');
  // const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleEventClick = (event: Event) => {
    console.log('Event clicked:', event.title);
    // TODO: Open event details modal or navigate to event page
  };

  return (
    <PageLayout
      header={
        <>
          <Breadcrumbs
            title={
              <div className='flex items-center gap-2'>
                <Calendar size={16} />
                Classes
              </div>
            }
          />
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search classes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {/* <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
            <TabsList>
              <TabsTrigger value="list" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                List
              </TabsTrigger>
              <div className="inline-flex">
                <TabsTrigger
                  value="calendar"
                  className="flex items-center gap-2"
                  disabled
                >
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </div>
            </TabsList>
            </Tabs> */}
            <TooltipProvider>
              <Tooltip>
                <EventCreateModal>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8'>
                      <Plus className="h-6 w-6" />
                    </Button>
                  </TooltipTrigger>
                </EventCreateModal>
                <TooltipContent>
                  <p>Schedule new class</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </>
      }
    >
      {isLoading ? (
        <ClassesSkeleton />
      ) : viewMode === 'list' ? (
        <ListView
          events={events}
          danceTypes={danceTypes}
          onEventClick={handleEventClick}
        />
      ) : (
        <CalendarView events={events} onEventClick={handleEventClick} />
      )}

      {!isLoading && events.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No classes scheduled</h3>
          <p className="text-muted-foreground">
            Get started by scheduling your first salsa class.
          </p>
          <EventCreateModal>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Schedule Your First Class
            </Button>
          </EventCreateModal>
        </div>
      )}
    </PageLayout>
  );
}
