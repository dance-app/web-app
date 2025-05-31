"use client"

import { useState } from "react"
import { useEvents } from "@/hooks/use-events"
import { CalendarView } from "@/components/classes/calendar-view"
import { ListView } from "@/components/classes/list-view"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, List, Calendar } from "lucide-react"
import type { Event } from "@/types"
import { Breadcrumbs } from "@/components/breadcrumbs"

type ViewMode = "list" | "calendar"

export default function ClassesPage() {
  const { events, danceTypes, loading } = useEvents()
  const [viewMode, setViewMode] = useState<ViewMode>("list")

  const handleEventClick = (event: Event) => {
    console.log("Event clicked:", event.title)
    // TODO: Open event details modal or navigate to event page
  }

  const handleCreateClass = () => {
    console.log("Create class clicked")
    // TODO: Open create class modal or navigate to create page
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <Breadcrumbs title="Classes" />
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading classes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumbs title="Classes" />
      </header>

      <div className="flex-1 space-y-4 p-4 md:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Classes</h2>
            <p className="text-muted-foreground">Manage your salsa classes and events ({events.length} total)</p>
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Switcher */}
            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as ViewMode)}>
              <TabsList>
                <TabsTrigger value="list" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  List
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Button onClick={handleCreateClass}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Class
            </Button>
          </div>
        </div>

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
            <Button className="mt-4" onClick={handleCreateClass}>
              <Plus className="mr-2 h-4 w-4" />
              Schedule Your First Class
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
