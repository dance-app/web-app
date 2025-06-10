import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';

const mockDanceTypes = [
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

const mockEvents = [
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Filter events by workspace ID
    const workspaceEvents = mockEvents.filter(event => event.workspaceId === workspaceId);

    return NextResponse.json({
      events: workspaceEvents,
      danceTypes: mockDanceTypes.filter(dt => dt.workspaceId === workspaceId)
    });
  } catch (error) {
    console.error('GET /api/workspace/[id]/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;
    const body = await request.json();

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const danceType = mockDanceTypes.find(dt => dt.id === body.danceTypeId);

    if (!danceType) {
      return NextResponse.json({ error: 'Invalid dance type' }, { status: 400 });
    }

    const newEvent = {
      id: `${mockEvents.length + 1}`,
      title: body.title || 'New Class',
      description: body.description || '',
      danceTypeId: body.danceTypeId || '1',
      danceType: danceType,
      startTime: body.startTime || new Date().toISOString(),
      endTime: body.endTime || new Date(Date.now() + 90 * 60000).toISOString(),
      maxParticipants: body.maxParticipants || 20,
      workspaceId: workspaceId,
      participations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // In a real implementation, you would save to database here
    mockEvents.push(newEvent);

    return NextResponse.json({ event: newEvent });
  } catch (error) {
    console.error('POST /api/workspace/[id]/events error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}