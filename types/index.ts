import { DanceType } from './dance';

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

export interface Member {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string | null;
  phone?: string | null;
  email?: string | null;
  roles: WorkspaceRole[];
  preferredDanceRole: DanceRole | null;
  user: User | null;
}

export interface User {
    createdAt: string;
    updatedAt: string;
    id: string;
    firstName: string;
    lastName: string;
    accounts?: {
      email: string;
      isEmailVerified: boolean;
    }[]
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

export enum WorkspaceRole {
  OWNER = 'OWNER',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
}
export enum DanceRole {
  LEADER = 'LEADER',
  FOLLOWER = 'FOLLOWER',
}

export type WorkspaceConfig = {
  id: string;
  createdAt: string;
  updatedAt: string;
  weekStart: WeekStart;
  danceTypes: DanceType[];
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
  memberId: string;
  member?: Member;
  eventId: string;
  event?: Event;
  status: 'registered' | 'present' | 'absent' | 'invited';
  registeredAt: string;
  attendedAt?: string;
}

export interface Subscription {
  id: string;
  memberId: string;
  member: Member;
  classesRemaining: number;
  totalClasses: number;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
