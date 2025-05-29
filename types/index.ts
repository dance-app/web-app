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

enum WeekStart {
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
