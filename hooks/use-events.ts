'use client';

import { useState, useEffect } from 'react';
import type { Event, DanceType } from '@/types';
import { useCurrentWorkspace } from './use-current-workspace';

export const mockDanceTypes = [
  {
    id: '1',
    name: 'Salsa',
    description: 'Cuban-style salsa',
    workspaceId: '1',
  },
  {
    id: '2',
    name: 'Bachata',
    description: 'Dominican bachata',
    workspaceId: '1',
  },
  {
    id: '3',
    name: 'Merengue',
    description: 'Traditional merengue',
    workspaceId: '1',
  },
  {
    id: '4',
    name: 'Kizomba',
    description: 'Angolan kizomba',
    workspaceId: '1',
  },
  {
    id: '5',
    name: 'Cha Cha',
    description: 'Cuban cha cha cha',
    workspaceId: '1',
  },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Beginner Salsa Class',
    description: 'Perfect for those just starting their salsa journey',
    danceTypeId: '1',
    danceType: mockDanceTypes[0],
    startTime: '2024-02-15T19:00:00Z',
    endTime: '2024-02-15T20:30:00Z',
    maxParticipants: 20,
    workspaceId: '1',
    participations: [
      {
        id: '1',
        studentId: '1',
        eventId: '1',
        status: 'registered' as const,
        registeredAt: '2024-02-10T10:00:00Z',
      },
      {
        id: '2',
        studentId: '2',
        eventId: '1',
        status: 'present' as const,
        registeredAt: '2024-02-10T11:00:00Z',
        attendedAt: '2024-02-15T19:00:00Z',
      },
    ],
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Intermediate Bachata Workshop',
    description: 'Take your bachata skills to the next level',
    danceTypeId: '2',
    danceType: mockDanceTypes[1],
    startTime: '2024-02-16T20:00:00Z',
    endTime: '2024-02-16T21:30:00Z',
    maxParticipants: 15,
    workspaceId: '1',
    participations: [
      {
        id: '3',
        studentId: '3',
        eventId: '2',
        status: 'registered' as const,
        registeredAt: '2024-02-11T14:00:00Z',
      },
    ],
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Advanced Salsa Technique',
    description: 'Master advanced salsa moves and styling',
    danceTypeId: '1',
    danceType: mockDanceTypes[0],
    startTime: '2024-02-17T18:00:00Z',
    endTime: '2024-02-17T19:30:00Z',
    maxParticipants: 12,
    workspaceId: '1',
    participations: [
      {
        id: '4',
        studentId: '4',
        eventId: '3',
        status: 'present' as const,
        registeredAt: '2024-02-12T09:00:00Z',
        attendedAt: '2024-02-17T18:00:00Z',
      },
      {
        id: '5',
        studentId: '2',
        eventId: '3',
        status: 'registered' as const,
        registeredAt: '2024-02-13T16:00:00Z',
      },
    ],
    createdAt: '2024-02-03T00:00:00Z',
    updatedAt: '2024-02-03T00:00:00Z',
  },
];

// Simulate a delay for async operations
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [danceTypes, setDanceTypes] = useState<DanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const { workspace } = useCurrentWorkspace();

  const fetchEvents = async () => {
    try {
      if (!workspace) return;

      setLoading(true);
      // Simulate API delay
      await delay(800);

      // Filter events by current workspace
      const workspaceEvents = mockEvents.filter(
        (e) => e.workspaceId === workspace.id
      );
      setEvents(workspaceEvents);
      console.log('Fetched events:', workspaceEvents);

      setLoading(false);
    } catch (error) {
      console.error('Fetch events error:', error);
      setLoading(false);
    }
  };

  const fetchDanceTypes = async () => {
    try {
      if (!workspace) return;

      // Simulate API delay
      await delay(500);

      // Filter dance types by current workspace
      const workspaceDanceTypes = mockDanceTypes.filter(
        (dt) => dt.workspaceId === workspace.id
      );
      setDanceTypes(workspaceDanceTypes);
      console.log('Fetched dance types:', workspaceDanceTypes);
    } catch (error) {
      console.error('Fetch dance types error:', error);
    }
  };

  const createEvent = async (data: Partial<Event>) => {
    try {
      if (!workspace) return { success: false, error: 'Not authenticated' };

      // Simulate API delay
      await delay(1000);

      const danceType = danceTypes.find((dt) => dt.id === data.danceTypeId);

      if (!danceType) {
        return { success: false, error: 'Invalid dance type' };
      }

      const newEvent: Event = {
        id: `${events.length + 1}`,
        title: data.title || 'New Class',
        description: data.description || '',
        danceTypeId: data.danceTypeId || '1',
        danceType: danceType,
        startTime: data.startTime || new Date().toISOString(),
        endTime:
          data.endTime || new Date(Date.now() + 90 * 60000).toISOString(),
        maxParticipants: data.maxParticipants || 20,
        workspaceId: workspace.id,
        participations: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setEvents((prev) => [...prev, newEvent]);
      console.log('Created event:', newEvent);

      return { success: true, event: newEvent };
    } catch (error) {
      console.error('Create event error:', error);
      return { success: false, error: 'Failed to create event' };
    }
  };

  const updateEvent = async (id: string, data: Partial<Event>) => {
    try {
      if (!workspace) return { success: false, error: 'Not authenticated' };

      // Simulate API delay
      await delay(800);

      const updatedEvents = events.map((event) => {
        if (event.id === id) {
          const updatedEvent = {
            ...event,
            ...data,
            updatedAt: new Date().toISOString(),
          };

          // If dance type changed, update the dance type object
          if (data.danceTypeId && data.danceTypeId !== event.danceTypeId) {
            const danceType = danceTypes.find(
              (dt) => dt.id === data.danceTypeId
            );
            if (danceType) {
              updatedEvent.danceType = danceType;
            }
          }

          return updatedEvent;
        }
        return event;
      });

      setEvents(updatedEvents);
      const updatedEvent = updatedEvents.find((e) => e.id === id);
      console.log('Updated event:', updatedEvent);

      return { success: true, event: updatedEvent };
    } catch (error) {
      console.error('Update event error:', error);
      return { success: false, error: 'Failed to update event' };
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      if (!workspace) return { success: false, error: 'Not authenticated' };

      // Simulate API delay
      await delay(600);

      setEvents((prev) => prev.filter((e) => e.id !== id));
      console.log('Deleted event:', id);

      return { success: true };
    } catch (error) {
      console.error('Delete event error:', error);
      return { success: false, error: 'Failed to delete event' };
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchDanceTypes();
  }, [workspace]);

  return {
    events,
    danceTypes,
    loading,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent,
  };
}
