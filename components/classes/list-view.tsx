'use client';

import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EventUpdateModal } from '@/components/events/event-update-modal';
import { EventDetailsModal } from '@/components/events/event-details-modal';
import { EventParticipantsModal } from '@/components/events/event-participants-modal';
import { Calendar, Clock, Users } from 'lucide-react';
import type { Event } from '@/types';
import { DanceType } from '@/types/dance';

interface ListViewProps {
  events: Event[];
  danceTypes: DanceType[];
  onEventClick?: (event: Event) => void;
}

export function ListView({ events, onEventClick }: ListViewProps) {
  const getStatusColor = (event: Event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (endTime < now) return 'secondary'; // Past
    if (startTime <= now && endTime >= now) return 'destructive'; // Ongoing
    return 'default'; // Future
  };

  const getStatusText = (event: Event) => {
    const now = new Date();
    const startTime = new Date(event.startTime);
    const endTime = new Date(event.endTime);

    if (endTime < now) return 'Completed';
    if (startTime <= now && endTime >= now) return 'In Progress';
    return 'Scheduled';
  };

  return (
    <div className="space-y-4">
      {/* Results count */}
      {/* <div className="text-sm text-muted-foreground">
        Showing {events.length} of {events.length} classes
      </div> */}

      {/* Events List */}
      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground text-center">
                No classes have been scheduled yet
              </p>
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
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
                      <Badge variant={getStatusColor(event)}>
                        {getStatusText(event)}
                      </Badge>
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
                    {format(new Date(event.startTime), 'PPP')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(event.startTime), 'p')} -{' '}
                    {format(new Date(event.endTime), 'p')}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    {event.participations?.length || 0}
                    {event.maxParticipants &&
                      ` / ${event.maxParticipants}`}{' '}
                    participants
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <EventDetailsModal event={event}>
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                  </EventDetailsModal>
                  <EventParticipantsModal event={event}>
                    <Button variant="outline" size="sm" className="flex-1">
                      Manage Participants
                    </Button>
                  </EventParticipantsModal>
                  <EventUpdateModal event={event}>
                    <Button variant="outline" size="sm" className="flex-1">
                      Edit Class
                    </Button>
                  </EventUpdateModal>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
