import { 
  Member, 
  Event, 
  Participation, 
  Subscription, 
  Workspace, 
  User, 
  WorkspaceRole, 
  DanceRole, 
  WeekStart 
} from '@/types';
import { DanceType } from '@/types/dance';
import { Material, MaterialVisibility } from '@/types/material';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    createdAt: '2024-01-01T00:00:00Z',
    isSuperAdmin: false,
    accounts: [
      {
        id: '1',
        provider: 'LOCAL',
        email: 'john.smith@example.com',
        isEmailVerified: true,
        createdAt: '2024-01-01T00:00:00Z',
      },
    ],
  },
  {
    id: '2',
    firstName: 'Maria',
    lastName: 'Garcia',
    createdAt: '2024-01-02T00:00:00Z',
    isSuperAdmin: false,
    accounts: [
      {
        id: '2',
        provider: 'GOOGLE',
        email: 'maria.garcia@gmail.com',
        isEmailVerified: true,
        createdAt: '2024-01-02T00:00:00Z',
      },
    ],
  },
  {
    id: '3',
    firstName: 'Carlos',
    lastName: 'Rodriguez',
    createdAt: '2024-01-03T00:00:00Z',
    isSuperAdmin: false,
    accounts: [
      {
        id: '3',
        provider: 'LOCAL',
        email: 'carlos.rodriguez@example.com',
        isEmailVerified: true,
        createdAt: '2024-01-03T00:00:00Z',
      },
    ],
  },
  {
    id: '4',
    firstName: 'Demo',
    lastName: 'User',
    createdAt: '2024-01-04T00:00:00Z',
    isSuperAdmin: false,
    accounts: [
      {
        id: '4',
        provider: 'LOCAL',
        email: 'demo@example.com',
        isEmailVerified: true,
        createdAt: '2024-01-04T00:00:00Z',
      },
    ],
  },
  {
    id: '5',
    firstName: 'Test',
    lastName: 'Admin',
    createdAt: '2024-01-05T00:00:00Z',
    isSuperAdmin: true,
    accounts: [
      {
        id: '5',
        provider: 'LOCAL',
        email: 'admin@example.com',
        isEmailVerified: true,
        createdAt: '2024-01-05T00:00:00Z',
      },
    ],
  },
];

// Mock Dance Types
export const mockDanceTypes: DanceType[] = [
  {
    id: '1',
    name: 'Salsa',
    description: 'Cuban-style salsa with complex footwork and rhythmic patterns',
    workspaceId: '1',
  },
  {
    id: '2',
    name: 'Bachata',
    description: 'Dominican dance with romantic and sensual movements',
    workspaceId: '1',
  },
  {
    id: '3',
    name: 'Merengue',
    description: 'Fast-paced Dominican dance with simple two-step rhythm',
    workspaceId: '1',
  },
  {
    id: '4',
    name: 'Kizomba',
    description: 'Angolan dance with slow, smooth, and flowing movements',
    workspaceId: '1',
  },
  {
    id: '5',
    name: 'Cha Cha',
    description: 'Latin ballroom dance with syncopated rhythm',
    workspaceId: '1',
  },
];

// Mock Workspaces
export const mockWorkspaces: Workspace[] = [
  {
    id: '1',
    name: 'Tropical Dance Studio',
    slug: 'tropical-dance-studio',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    createdById: '1',
    createdBy: mockUsers[0],
    configuration: {
      id: '1',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z',
      weekStart: WeekStart.MONDAY,
      danceTypes: mockDanceTypes,
    },
  },
  {
    id: '2',
    name: 'Rhythm Academy',
    slug: 'rhythm-academy',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    createdById: '2',
    createdBy: mockUsers[1],
    configuration: {
      id: '2',
      createdAt: '2024-01-02T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z',
      weekStart: WeekStart.SUNDAY,
      danceTypes: mockDanceTypes.slice(0, 3),
    },
  },
];

// Mock Members
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    createdAt: new Date('2024-01-05T00:00:00Z'),
    updatedAt: new Date('2024-01-05T00:00:00Z'),
    createdById: '1',
    createdBy: mockUsers[0],
    user: null,
    workspaceId: '1',
    workspace: mockWorkspaces[0],
    roles: [WorkspaceRole.STUDENT],
    level: 2,
    preferedDanceRole: DanceRole.FOLLOWER,
  },
  {
    id: '2',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    createdAt: new Date('2024-01-06T00:00:00Z'),
    updatedAt: new Date('2024-01-06T00:00:00Z'),
    createdById: '1',
    createdBy: mockUsers[0],
    user: null,
    workspaceId: '1',
    workspace: mockWorkspaces[0],
    roles: [WorkspaceRole.STUDENT],
    level: 4,
    preferedDanceRole: DanceRole.LEADER,
  },
  {
    id: '3',
    name: 'Carmen Silva',
    email: 'carmen.silva@example.com',
    createdAt: new Date('2024-01-07T00:00:00Z'),
    updatedAt: new Date('2024-01-07T00:00:00Z'),
    createdById: '1',
    createdBy: mockUsers[0],
    user: null,
    workspaceId: '1',
    workspace: mockWorkspaces[0],
    roles: [WorkspaceRole.TEACHER],
    level: 8,
    preferedDanceRole: DanceRole.FOLLOWER,
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    createdAt: new Date('2024-01-08T00:00:00Z'),
    updatedAt: new Date('2024-01-08T00:00:00Z'),
    createdById: '1',
    createdBy: mockUsers[0],
    user: null,
    workspaceId: '1',
    workspace: mockWorkspaces[0],
    roles: [WorkspaceRole.STUDENT],
    level: 1,
    preferedDanceRole: DanceRole.LEADER,
  },
  {
    id: '5',
    name: 'Elena Castillo',
    email: 'elena.castillo@example.com',
    createdAt: new Date('2024-01-09T00:00:00Z'),
    updatedAt: new Date('2024-01-09T00:00:00Z'),
    createdById: '1',
    createdBy: mockUsers[0],
    user: null,
    workspaceId: '1',
    workspace: mockWorkspaces[0],
    roles: [WorkspaceRole.TEACHER, WorkspaceRole.STUDENT],
    level: 7,
    preferedDanceRole: DanceRole.FOLLOWER,
  },
];

// Mock Participations
export const mockParticipations: Participation[] = [
  {
    id: '1',
    memberId: '1',
    member: mockMembers[0],
    eventId: '1',
    status: 'registered',
    registeredAt: '2024-02-10T10:00:00Z',
  },
  {
    id: '2',
    memberId: '2',
    member: mockMembers[1],
    eventId: '1',
    status: 'present',
    registeredAt: '2024-02-10T11:00:00Z',
    attendedAt: '2024-02-15T19:00:00Z',
  },
  {
    id: '3',
    memberId: '3',
    member: mockMembers[2],
    eventId: '2',
    status: 'registered',
    registeredAt: '2024-02-11T10:00:00Z',
  },
  {
    id: '4',
    memberId: '4',
    member: mockMembers[3],
    eventId: '2',
    status: 'absent',
    registeredAt: '2024-02-11T11:00:00Z',
  },
  {
    id: '5',
    memberId: '5',
    member: mockMembers[4],
    eventId: '3',
    status: 'invited',
    registeredAt: '2024-02-12T10:00:00Z',
  },
];

// Mock Events
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
    participations: mockParticipations.slice(0, 2),
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Intermediate Bachata Workshop',
    description: 'Focus on advanced footwork and styling techniques',
    danceTypeId: '2',
    danceType: mockDanceTypes[1],
    startTime: '2024-02-16T20:00:00Z',
    endTime: '2024-02-16T21:30:00Z',
    maxParticipants: 15,
    workspaceId: '1',
    participations: mockParticipations.slice(2, 4),
    createdAt: '2024-02-02T00:00:00Z',
    updatedAt: '2024-02-02T00:00:00Z',
  },
  {
    id: '3',
    title: 'Advanced Kizomba Social',
    description: 'Social dancing with advanced Kizomba techniques',
    danceTypeId: '4',
    danceType: mockDanceTypes[3],
    startTime: '2024-02-17T21:00:00Z',
    endTime: '2024-02-17T23:00:00Z',
    maxParticipants: 25,
    workspaceId: '1',
    participations: mockParticipations.slice(4, 5),
    createdAt: '2024-02-03T00:00:00Z',
    updatedAt: '2024-02-03T00:00:00Z',
  },
  {
    id: '4',
    title: 'Merengue Fundamentals',
    description: 'Learn the basic steps and rhythm of Merengue',
    danceTypeId: '3',
    danceType: mockDanceTypes[2],
    startTime: '2024-02-18T18:00:00Z',
    endTime: '2024-02-18T19:30:00Z',
    maxParticipants: 30,
    workspaceId: '1',
    participations: [],
    createdAt: '2024-02-04T00:00:00Z',
    updatedAt: '2024-02-04T00:00:00Z',
  },
  {
    id: '5',
    title: 'Cha Cha Competition Prep',
    description: 'Prepare for upcoming Cha Cha competition',
    danceTypeId: '5',
    danceType: mockDanceTypes[4],
    startTime: '2024-02-19T19:30:00Z',
    endTime: '2024-02-19T21:00:00Z',
    maxParticipants: 12,
    workspaceId: '1',
    participations: [],
    createdAt: '2024-02-05T00:00:00Z',
    updatedAt: '2024-02-05T00:00:00Z',
  },
];

// Mock Subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    memberId: '1',
    member: mockMembers[0],
    classesRemaining: 8,
    totalClasses: 10,
    expiresAt: '2024-03-01T00:00:00Z',
    isActive: true,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-02-10T00:00:00Z',
  },
  {
    id: '2',
    memberId: '2',
    member: mockMembers[1],
    classesRemaining: 15,
    totalClasses: 20,
    expiresAt: '2024-04-01T00:00:00Z',
    isActive: true,
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-02-01T00:00:00Z',
  },
  {
    id: '3',
    memberId: '4',
    member: mockMembers[3],
    classesRemaining: 0,
    totalClasses: 5,
    expiresAt: '2024-01-31T00:00:00Z',
    isActive: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-31T00:00:00Z',
  },
];

// Mock Materials
export const mockMaterials: Material[] = [
  {
    id: 1,
    name: 'Salsa Basic Steps Tutorial',
    description: 'Complete guide to mastering basic salsa steps',
    videoUrls: ['https://example.com/salsa-basics-1.mp4', 'https://example.com/salsa-basics-2.mp4'],
    imageUrls: ['https://example.com/salsa-basics-thumb.jpg'],
    visibility: MaterialVisibility.WORKSPACE,
    workspaceId: 1,
    parentMaterialId: null,
    danceTypeId: 1,
    danceType: {
      id: '1',
      name: 'Salsa',
      description: 'Cuban-style salsa with complex footwork and rhythmic patterns',
      workspaceId: '1',
    },
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
    deletedAt: null,
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
    },
    workspace: null,
    parentMaterial: null,
    childMaterials: [],
  },
  {
    id: 2,
    name: 'Bachata Styling Techniques',
    description: 'Advanced styling moves for bachata dancers',
    videoUrls: ['https://example.com/bachata-styling.mp4'],
    imageUrls: ['https://example.com/bachata-styling-thumb.jpg', 'https://example.com/bachata-styling-2.jpg'],
    visibility: MaterialVisibility.PUBLIC,
    workspaceId: 1,
    parentMaterialId: null,
    danceTypeId: 2,
    danceType: {
      id: '2',
      name: 'Bachata',
      description: 'Dominican dance with romantic and sensual movements',
      workspaceId: '1',
    },
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z',
    deletedAt: null,
    createdBy: {
      id: 2,
      firstName: 'Maria',
      lastName: 'Garcia',
    },
    workspace: null,
    parentMaterial: null,
    childMaterials: [],
  },
  {
    id: 3,
    name: 'Kizomba Connection & Flow',
    description: 'Developing better connection and flow in Kizomba',
    videoUrls: ['https://example.com/kizomba-connection.mp4'],
    imageUrls: ['https://example.com/kizomba-connection-thumb.jpg'],
    visibility: MaterialVisibility.PRIVATE,
    workspaceId: 1,
    parentMaterialId: null,
    danceTypeId: 4,
    danceType: {
      id: '4',
      name: 'Kizomba',
      description: 'Angolan dance with slow, smooth, and flowing movements',
      workspaceId: '1',
    },
    createdAt: '2024-01-14T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
    deletedAt: null,
    createdBy: {
      id: 3,
      firstName: 'Carlos',
      lastName: 'Rodriguez',
    },
    workspace: null,
    parentMaterial: null,
    childMaterials: [],
  },
  {
    id: 4,
    name: 'Merengue Rhythm Patterns',
    description: 'Understanding and dancing to different merengue rhythms',
    videoUrls: ['https://example.com/merengue-rhythm.mp4'],
    imageUrls: ['https://example.com/merengue-rhythm-thumb.jpg'],
    visibility: MaterialVisibility.WORKSPACE,
    workspaceId: 1,
    parentMaterialId: null,
    danceTypeId: 3,
    danceType: {
      id: '3',
      name: 'Merengue',
      description: 'Fast-paced Dominican dance with simple two-step rhythm',
      workspaceId: '1',
    },
    createdAt: '2024-01-16T00:00:00Z',
    updatedAt: '2024-01-16T00:00:00Z',
    deletedAt: null,
    createdBy: {
      id: 1,
      firstName: 'John',
      lastName: 'Smith',
    },
    workspace: null,
    parentMaterial: null,
    childMaterials: [],
  },
  {
    id: 5,
    name: 'Cha Cha Competition Routine',
    description: 'Step-by-step breakdown of competition cha cha routine',
    videoUrls: ['https://example.com/chacha-routine.mp4'],
    imageUrls: ['https://example.com/chacha-routine-thumb.jpg'],
    visibility: MaterialVisibility.PUBLIC,
    workspaceId: 1,
    parentMaterialId: null,
    danceTypeId: 5,
    danceType: {
      id: '5',
      name: 'Cha Cha',
      description: 'Latin ballroom dance with syncopated rhythm',
      workspaceId: '1',
    },
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
    deletedAt: null,
    createdBy: {
      id: 2,
      firstName: 'Maria',
      lastName: 'Garcia',
    },
    workspace: null,
    parentMaterial: null,
    childMaterials: [],
  },
];

// Mock Dashboard Data
export const mockDashboardData = {
  totalMembers: mockMembers.length,
  activeMembers: mockMembers.filter(m => m.roles.includes(WorkspaceRole.STUDENT)).length,
  totalEvents: mockEvents.length,
  upcomingEvents: mockEvents.filter(e => new Date(e.startTime) > new Date()).length,
  totalMaterials: mockMaterials.length,
  publicMaterials: mockMaterials.filter(m => m.visibility === MaterialVisibility.PUBLIC).length,
  totalSubscriptions: mockSubscriptions.length,
  activeSubscriptions: mockSubscriptions.filter(s => s.isActive).length,
  totalRevenue: mockSubscriptions.reduce((sum, sub) => sum + (sub.totalClasses * 25), 0), // Assuming $25 per class
  membershipGrowth: [
    { month: 'Jan', members: 15 },
    { month: 'Feb', members: 18 },
    { month: 'Mar', members: 22 },
    { month: 'Apr', members: 28 },
    { month: 'May', members: 32 },
    { month: 'Jun', members: mockMembers.length },
  ],
  classAttendance: [
    { danceType: 'Salsa', attendance: 85 },
    { danceType: 'Bachata', attendance: 78 },
    { danceType: 'Merengue', attendance: 65 },
    { danceType: 'Kizomba', attendance: 72 },
    { danceType: 'Cha Cha', attendance: 60 },
  ],
};

// Helper function to get mock data by workspace
export const getMockDataByWorkspace = (workspaceSlug: string) => {
  const workspace = mockWorkspaces.find(w => w.slug === workspaceSlug);
  if (!workspace) return null;

  return {
    workspace,
    members: mockMembers.filter(m => m.workspaceId === workspace.id),
    events: mockEvents.filter(e => e.workspaceId === workspace.id),
    materials: mockMaterials.filter(m => m.workspaceId === parseInt(workspace.id)),
    subscriptions: mockSubscriptions.filter(s => 
      mockMembers.some(m => m.id === s.memberId && m.workspaceId === workspace.id)
    ),
    danceTypes: workspace.configuration?.danceTypes || [],
    dashboard: mockDashboardData,
  };
};

// Helper function to simulate API delay
export const mockApiDelay = (ms: number = 500) => 
  new Promise(resolve => setTimeout(resolve, ms));

// Helper function to generate paginated response
export const generatePaginatedResponse = <T>(
  data: T[], 
  page: number = 1, 
  limit: number = 10
) => {
  const offset = (page - 1) * limit;
  const paginatedData = data.slice(offset, offset + limit);
  
  return {
    data: paginatedData,
    meta: {
      count: paginatedData.length,
      totalCount: data.length,
      limit,
      offset,
      page,
      pages: Math.ceil(data.length / limit),
    },
  };
};