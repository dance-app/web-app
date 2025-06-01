export type LocalApiResponse<SuccessType, ErrorMessageType> =
  | {
      success: true;
      data: SuccessType;
    }
  | {
      success: false;
      error: {
        message: ErrorMessageType;
        details?: Record<string, any>;
      };
      statusCode: number;
    };

export interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'leader' | 'follower' | 'both';
  level: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  isSuperAdmin: boolean;
  accounts: {
    id: string;
    provider: 'LOCAL' | 'GOOGLE' | 'GITHUB';
    email: string;
    isEmailVerified: boolean;
    createdAt: string;
  }[];
}

export type AuthState =
  | {
      status: 'loading';
      token: null;
      refreshToken: null;
    }
  | {
      status: 'authenticated';
      token: string;
      refreshToken: string;
    }
  | {
      status: 'unauthenticated';
      token: null;
      refreshToken: null;
    };

export enum WeekStart {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  SATURDAY = 'SATURDAY',
}

export type WorkspaceConfig = {
  id: string;
  createdAt: string;
  updatedAt: string;
  weekStart: WeekStart;
};

export type Workspace = {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdById: string;
  createdBy?: User;
  name: string;
  slug: string;
  configuration?: WorkspaceConfig;
  // members: Member[]
  // events: Event[]
  // invitations Invitation[]
};

export interface DanceType {
  id: string;
  name: string;
  description?: string;
  workspaceId: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  danceTypeId: string;
  danceType: DanceType;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  workspaceId: Workspace['id'];
  participations: Participation[];
  createdAt: string;
  updatedAt: string;
}

export interface Participation {
  id: string;
  studentId: string;
  student?: Student;
  eventId: string;
  event?: Event;
  status: 'registered' | 'present' | 'absent';
  registeredAt: string;
  attendedAt?: string;
}

export interface Subscription {
  id: string;
  studentId: string;
  student: Student;
  classesRemaining: number;
  totalClasses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
