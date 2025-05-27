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
