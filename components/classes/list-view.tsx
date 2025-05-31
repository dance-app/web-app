"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Users, Search, Filter } from "lucide-react"
import type { Event, DanceType } from "@/types"

interface ListViewProps {
  events: Event[]
  danceTypes: DanceType[]
  onEventClick?: (event: Event) => void
}

export function ListView({ events, danceTypes, onEventClick }: ListViewProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDanceType, setSelectedDanceType] = useState<string>("all")
  const [sortBy, setSortBy] = useState<"date" | "title" | "danceType">("date")

  const filteredAndSortedEvents = events
    .filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.danceType.name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDanceType = selectedDanceType === "all" || event.danceType.id === selectedDanceType

      return matchesSearch && matchesDanceType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "danceType":
          return a.danceType.name.localeCompare(b.danceType.name)
        default:
          return 0
      }
    })

  const getStatusColor = (event: Event) => {
    const now = new Date()
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    if (endTime < now) return "secondary" // Past
    if (startTime <= now && endTime >= now) return "destructive" // Ongoing
    return "default" // Future
  }

  const getStatusText = (event: Event) => {
    const now = new Date()
    const startTime = new Date(event.startTime)
    const endTime = new Date(event.endTime)

    if (endTime < now) return "Completed"
    if (startTime <= now && endTime >= now) return "In Progress"
    return "Scheduled"
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search classes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <Select value={selectedDanceType} onValueChange={setSelectedDanceType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Dance Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Dance Types</SelectItem>
            {danceTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value: "date" | "title" | "danceType") => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="danceType">Dance Type</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedEvents.length} of {events.length} classes
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredAndSortedEvents.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground text-center">
                {searchTerm || selectedDanceType !== "all"
                  ? "Try adjusting your search or filters"
                  : "No classes have been scheduled yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredAndSortedEvents.map((event) => (
            <Card
              key={event.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onEventClick?.(event)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {event.title}
                      <Badge variant={getStatusColor(event)}>{getStatusText(event)}</Badge>
                    </CardTitle>
                    <CardDescription>{event.description}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {event.danceType.name}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(event.startTime), "PPP")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(event.startTime), "p")} - {format(new Date(event.endTime), "p")}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {event.participations?.length || 0}
                    {event.maxParticipants && ` / ${event.maxParticipants}`} participants
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Manage Participants
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Class
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
