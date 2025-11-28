import {
  mockWorkspaces,
  mockMembers,
  mockEvents,
  mockMaterials,
  mockDashboardData,
  mockUsers,
  getMockDataByWorkspace,
  mockApiDelay,
  generatePaginatedResponse,
} from './mock-data';
import { LocalApiResponse, WeekStart, WorkspaceRole, DanceRole } from '@/types';

// Mock data is hardcoded on; env toggling was removed to keep consistency during refactors.
export const USE_MOCK_DATA = true;

// Mock API response wrapper
export class MockApi {
  // Workspaces
  static async getWorkspaces() {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(300);
    return {
      data: mockWorkspaces,
      meta: {
        count: mockWorkspaces.length,
        totalCount: mockWorkspaces.length,
        limit: 10,
        offset: 0,
        page: 1,
        pages: 1,
      },
    };
  }

  static async createWorkspace(data: { name: string; slug: string }) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(500);
    const newWorkspace = {
      id: String(mockWorkspaces.length + 1),
      name: data.name,
      slug: data.slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdById: '1',
      configuration: {
        id: String(mockWorkspaces.length + 1),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        weekStart: WeekStart.MONDAY,
        danceTypes: [],
      },
    };

    mockWorkspaces.push(newWorkspace);
    return newWorkspace;
  }

  // Members
  static async getMembers(
    workspaceSlug: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const paginatedResponse = generatePaginatedResponse(
      mockData.members,
      page,
      limit
    );
    return { success: true, data: paginatedResponse } as LocalApiResponse<
      typeof paginatedResponse,
      string
    >;
  }

  static async updateMember(
    workspaceSlug: string,
    memberId: string,
    memberData: {
      name?: string;
      email?: string;
      level?: number;
      preferedDanceRole?: DanceRole;
      roles?: WorkspaceRole[];
    }
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const memberIndex = mockMembers.findIndex(
      (m) => m.id === memberId && m.workspaceId === mockData.workspace.id
    );
    if (memberIndex === -1) {
      return {
        success: false,
        error: { message: 'Member not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    // Update the member
    const updatedMember = {
      ...mockMembers[memberIndex],
      ...memberData,
      updatedAt: new Date(),
    };

    mockMembers[memberIndex] = updatedMember;

    return { success: true, data: updatedMember } as LocalApiResponse<
      typeof updatedMember,
      string
    >;
  }

  static async deleteMember(workspaceSlug: string, memberId: string) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(300);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const memberIndex = mockMembers.findIndex(
      (m) => m.id === memberId && m.workspaceId === mockData.workspace.id
    );
    if (memberIndex === -1) {
      return {
        success: false,
        error: { message: 'Member not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    // Remove the member from the array
    const deletedMember = mockMembers.splice(memberIndex, 1)[0];

    return { success: true, data: deletedMember } as LocalApiResponse<
      typeof deletedMember,
      string
    >;
  }

  // Events
  static async getEvents(
    workspaceSlug: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const paginatedResponse = generatePaginatedResponse(
      mockData.events,
      page,
      limit
    );
    return {
      success: true,
      data: {
        events: paginatedResponse.data,
        danceTypes: mockData.danceTypes,
        meta: paginatedResponse.meta,
      },
    } as LocalApiResponse<any, string>;
  }

  static async createEvent(
    workspaceSlug: string,
    eventData: {
      title: string;
      description?: string;
      danceTypeId: string;
      startTime: string;
      endTime: string;
      maxParticipants?: number;
    }
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(500);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const danceType = mockData.danceTypes.find(
      (dt) => dt.id === eventData.danceTypeId
    );
    if (!danceType) {
      return {
        success: false,
        error: { message: 'Dance type not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const newEvent = {
      id: String(mockEvents.length + 1),
      title: eventData.title,
      description: eventData.description,
      danceTypeId: eventData.danceTypeId,
      danceType,
      startTime: eventData.startTime,
      endTime: eventData.endTime,
      maxParticipants: eventData.maxParticipants,
      workspaceId: mockData.workspace.id,
      participations: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockEvents.push(newEvent);
    return { success: true, data: newEvent } as LocalApiResponse<
      typeof newEvent,
      string
    >;
  }

  static async updateEvent(
    workspaceSlug: string,
    eventId: string,
    eventData: {
      title?: string;
      description?: string;
      danceTypeId?: string;
      startTime?: string;
      endTime?: string;
      maxParticipants?: number;
    }
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(500);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const eventIndex = mockEvents.findIndex(
      (e) => e.id === eventId && e.workspaceId === mockData.workspace.id
    );
    if (eventIndex === -1) {
      return {
        success: false,
        error: { message: 'Event not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const event = mockEvents[eventIndex];
    const updatedEvent = {
      ...event,
      ...eventData,
      updatedAt: new Date().toISOString(),
    };

    if (eventData.danceTypeId) {
      const danceType = mockData.danceTypes.find(
        (dt) => dt.id === eventData.danceTypeId
      );
      if (danceType) {
        updatedEvent.danceType = danceType;
      }
    }

    mockEvents[eventIndex] = updatedEvent;
    return { success: true, data: updatedEvent } as LocalApiResponse<
      typeof updatedEvent,
      string
    >;
  }

  static async deleteEvent(workspaceSlug: string, eventId: string) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(300);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const eventIndex = mockEvents.findIndex(
      (e) => e.id === eventId && e.workspaceId === mockData.workspace.id
    );
    if (eventIndex === -1) {
      return {
        success: false,
        error: { message: 'Event not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const deletedEvent = mockEvents.splice(eventIndex, 1)[0];
    return { success: true, data: deletedEvent } as LocalApiResponse<
      typeof deletedEvent,
      string
    >;
  }

  // Materials
  static async getMaterials(
    workspaceSlug: string,
    page: number = 1,
    limit: number = 10
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const paginatedResponse = generatePaginatedResponse(
      mockData.materials,
      page,
      limit
    );
    return {
      materials: paginatedResponse,
    };
  }

  static async getMarketplaceMaterials(page: number = 1, limit: number = 10) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);
    const publicMaterials = mockMaterials.filter(
      (m) => m.visibility === 'PUBLIC'
    );
    const paginatedResponse = generatePaginatedResponse(
      publicMaterials,
      page,
      limit
    );
    return {
      materials: paginatedResponse,
    };
  }

  static async createMaterial(
    workspaceSlug: string,
    materialData: {
      name: string;
      description: string;
      videoUrls: string[];
      imageUrls: string[];
      visibility: 'PRIVATE' | 'WORKSPACE' | 'PUBLIC';
      danceTypeId?: number;
    }
  ) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(500);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    const newMaterial = {
      id: mockMaterials.length + 1,
      name: materialData.name,
      description: materialData.description,
      videoUrls: materialData.videoUrls,
      imageUrls: materialData.imageUrls,
      visibility: materialData.visibility as any,
      workspaceId: parseInt(mockData.workspace.id),
      parentMaterialId: null,
      danceTypeId: materialData.danceTypeId || null,
      danceType: materialData.danceTypeId
        ? mockData.danceTypes.find(
            (dt) => dt.id === String(materialData.danceTypeId)
          ) || null
        : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deletedAt: null,
      createdBy: {
        id: 1,
        firstName: 'Mock',
        lastName: 'User',
      },
      workspace: null,
      parentMaterial: null,
      childMaterials: [],
    };

    mockMaterials.push(newMaterial);
    return { success: true, data: newMaterial } as LocalApiResponse<
      typeof newMaterial,
      string
    >;
  }

  // Dashboard
  static async getDashboard(workspaceSlug: string) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(300);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    return { success: true, data: mockData.dashboard } as LocalApiResponse<
      typeof mockData.dashboard,
      string
    >;
  }

  // Dance Types
  static async getDanceTypes(workspaceSlug: string) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(200);
    const mockData = getMockDataByWorkspace(workspaceSlug);
    if (!mockData) {
      return {
        success: false,
        error: { message: 'Workspace not found' },
        statusCode: 404,
      } as LocalApiResponse<any, string>;
    }

    return { success: true, data: mockData.danceTypes } as LocalApiResponse<
      typeof mockData.danceTypes,
      string
    >;
  }

  // Auth
  static async getCurrentUser() {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(200);
    return {
      user: mockUsers[0], // Return the first mock user as the current user
    };
  }

  static async refreshTokens() {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(300);
    return {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }

  static async signIn(credentials: { email: string; password: string }) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(400);

    // Mock validation - accept any email/password for demo
    // In a real scenario, you'd validate against your mock users
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }

    // Find user by email or use default user
    const user =
      mockUsers.find((u) =>
        u.accounts.some((acc) => acc.email === credentials.email)
      ) || mockUsers[0];

    return {
      user,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }

  static async signUp(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    if (!USE_MOCK_DATA) return null;

    await mockApiDelay(500);

    // Validate required fields
    if (
      !userData.email ||
      !userData.password ||
      !userData.firstName ||
      !userData.lastName
    ) {
      throw new Error(
        'All fields (email, password, first name, last name) are required'
      );
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) =>
      u.accounts.some((acc) => acc.email === userData.email)
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Create new mock user
    const newUser = {
      id: String(mockUsers.length + 1),
      firstName: userData.firstName,
      lastName: userData.lastName,
      createdAt: new Date().toISOString(),
      isSuperAdmin: false,
      accounts: [
        {
          id: String(mockUsers.length + 1),
          provider: 'LOCAL' as const,
          email: userData.email,
          isEmailVerified: false,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    // Add to mock users array
    mockUsers.push(newUser);

    return {
      user: newUser,
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
    };
  }
}

// Helper function to check if mock data should be used
export const shouldUseMockData = () => USE_MOCK_DATA;

// Helper function to log mock data usage
export const logMockDataUsage = (endpoint: string) => {
  if (USE_MOCK_DATA) {
    console.log(`🎭 Mock API: ${endpoint}`);
  }
};
