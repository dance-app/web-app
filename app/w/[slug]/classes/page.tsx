"use client"

import { useState } from "react"
import { useEvents } from "@/hooks/use-events"
import { CalendarView } from "@/components/classes/calendar-view"
import { ListView } from "@/components/classes/list-view"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EventCreateModal } from "@/components/events/event-create-modal"
// import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Plus, List, Calendar, Search } from "lucide-react"
import type { Event } from "@/types"
// import { DateRange } from "react-day-picker"
import { Breadcrumbs } from "@/components/breadcrumbs"
import { Spinner } from "@/components/ui/spinner"

type ViewMode = "list" | "calendar"

export default function ClassesPage() {
  const { events, danceTypes, isLoading } = useEvents()
  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [searchTerm, setSearchTerm] = useState("")
  // const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event.title)
    // TODO: Open event details modal or navigate to event page
  }


  if (isLoading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <Breadcrumbs title="Classes" />
          <div className="flex gap-2">
            <Button disabled>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
        <Breadcrumbs title="Classes" />
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
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
          <EventCreateModal>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </EventCreateModal>
        </div>
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8 bg-gray-50">

        {/* View Content */}
        {viewMode === "list" ? (
          <ListView events={events} danceTypes={danceTypes} onEventClick={handleEventClick} />
        ) : (
          <CalendarView events={events} onEventClick={handleEventClick} />
        )}

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">No classes scheduled</h3>
            <p className="text-muted-foreground">Get started by scheduling your first salsa class.</p>
            <EventCreateModal>
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Schedule Your First Class
              </Button>
            </EventCreateModal>
          </div>
        )}
      </div>
    </div>
  )
}
