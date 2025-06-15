'use client';

import { useState } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
} from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';
import type { Event } from '@/types';

interface CalendarViewProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
}

type CalendarViewType = 'month' | 'week' | 'day';

export function CalendarView({ events, onEventClick }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<CalendarViewType>('month');

  const navigatePrevious = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
    }
  };

  const navigateNext = () => {
    switch (viewType) {
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
    }
  };

  const navigateToday = () => {
    setCurrentDate(new Date());
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(new Date(event.startTime), date));
  };

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Header */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {/* Days */}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-1 border border-border ${
                isCurrentMonth ? 'bg-background' : 'bg-muted/30'
              } ${isToday ? 'bg-primary/5 border-primary' : ''}`}
            >
              <div
                className={`text-sm ${
                  isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'
                } ${isToday ? 'font-bold' : ''}`}
              >
                {format(day, 'd')}
              </div>
              <div className="space-y-1 mt-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="text-xs p-1 rounded bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 truncate"
                  >
                    {format(new Date(event.startTime), 'HH:mm')} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-muted-foreground">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="grid grid-cols-8 gap-1">
        {/* Time column header */}
        <div className="p-2 text-center text-sm font-medium text-muted-foreground">
          Time
        </div>

        {/* Day headers */}
        {weekDays.map((day) => (
          <div key={day.toISOString()} className="p-2 text-center">
            <div className="text-sm font-medium">{format(day, 'EEE')}</div>
            <div
              className={`text-lg ${
                isSameDay(day, new Date()) ? 'font-bold text-primary' : ''
              }`}
            >
              {format(day, 'd')}
            </div>
          </div>
        ))}

        {/* Time slots */}
        {hours.map((hour) => (
          <div key={hour} className="contents">
            {/* Time label */}
            <div className="p-2 text-xs text-muted-foreground border-t border-border">
              {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
            </div>

            {/* Day columns */}
            {weekDays.map((day) => {
              const dayEvents = getEventsForDate(day).filter((event) => {
                const eventHour = new Date(event.startTime).getHours();
                return eventHour === hour;
              });

              return (
                <div
                  key={`${day.toISOString()}-${hour}`}
                  className="min-h-[60px] p-1 border-t border-border"
                >
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => onEventClick?.(event)}
                      className="text-xs p-2 rounded bg-primary/10 text-primary cursor-pointer hover:bg-primary/20 mb-1"
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-muted-foreground">
                        {format(new Date(event.startTime), 'HH:mm')} -{' '}
                        {format(new Date(event.endTime), 'HH:mm')}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  const renderDayView = () => {
    const dayEvents = getEventsForDate(currentDate);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    return (
      <div className="space-y-1">
        <div className="text-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Time slots */}
          <div className="space-y-1">
            {hours.map((hour) => {
              const hourEvents = dayEvents.filter((event) => {
                const eventHour = new Date(event.startTime).getHours();
                return eventHour === hour;
              });

              return (
                <div key={hour} className="flex border-b border-border">
                  <div className="w-16 p-2 text-xs text-muted-foreground">
                    {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
                  </div>
                  <div className="flex-1 min-h-[60px] p-2">
                    {hourEvents.map((event) => (
                      <Card
                        key={event.id}
                        onClick={() => onEventClick?.(event)}
                        className="cursor-pointer hover:shadow-md transition-shadow mb-2"
                      >
                        <CardContent className="p-3">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(event.startTime), 'HH:mm')} -{' '}
                            {format(new Date(event.endTime), 'HH:mm')}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline">
                              {event.danceType.name}
                            </Badge>
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.participations?.length || 0}
                              {event.maxParticipants &&
                                ` / ${event.maxParticipants}`}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Event summary */}
          <div className="space-y-4">
            <h4 className="font-semibold">
              Today's Classes ({dayEvents.length})
            </h4>
            {dayEvents.length === 0 ? (
              <p className="text-muted-foreground">
                No classes scheduled for today
              </p>
            ) : (
              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <Card
                    key={event.id}
                    onClick={() => onEventClick?.(event)}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-3">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {event.description}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{event.danceType.name}</Badge>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(event.startTime), 'HH:mm')} -{' '}
                          {format(new Date(event.endTime), 'HH:mm')}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {event.participations?.length || 0}
                          {event.maxParticipants &&
                            ` / ${event.maxParticipants}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const getDateRangeText = () => {
    switch (viewType) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        const weekStart = startOfWeek(currentDate);
        const weekEnd = endOfWeek(currentDate);
        return `${format(weekStart, 'MMM d')} - ${format(
          weekEnd,
          'MMM d, yyyy'
        )}`;
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <div className="space-y-4">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={navigatePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={navigateToday}>
            Today
          </Button>
          <h3 className="text-lg font-semibold ml-4">{getDateRangeText()}</h3>
        </div>

        <div className="flex items-center gap-1">
          {(['month', 'week', 'day'] as CalendarViewType[]).map((type) => (
            <Button
              key={type}
              variant={viewType === type ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewType(type)}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Calendar Content */}
      <div className="border rounded-lg overflow-hidden">
        {viewType === 'month' && renderMonthView()}
        {viewType === 'week' && renderWeekView()}
        {viewType === 'day' && renderDayView()}
      </div>
    </div>
  );
}
