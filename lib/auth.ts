import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BASE_URL, ERROR_MESSAGES, type ApiResponse } from '@/lib/api/shared.api';
import type { User } from '@/types';

async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = (await response.json()) as ApiResponse<{
      accessToken: string;
      refreshToken: string;
    }>;

    if (!('data' in refreshedTokens) || !refreshedTokens.data.accessToken) {
      throw new Error('Missing access token in refresh response');
    }

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
      refreshToken:
        refreshedTokens.data.refreshToken ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const payload = (await res.json()) as ApiResponse<{
            user: User;
            accessToken: string;
            refreshToken: string;
          }>;

          if (!('data' in payload)) {
            const codeKey =
              typeof payload.message === 'string'
                ? payload.message
                : payload.message?.[0];
            const friendly =
              (codeKey && ERROR_MESSAGES[codeKey]) ||
              (typeof payload.message === 'string'
                ? payload.message
                : payload.message?.[0]) ||
              'Authentication failed';
            throw new Error(friendly);
          }

          if (!payload.data.user || !payload.data.accessToken) {
            throw new Error('Invalid authentication response');
          }

          // Return user object with tokens, using your existing User type structure
          return {
            ...payload.data.user,
            accessToken: payload.data.accessToken,
            refreshToken: payload.data.refreshToken,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in: store tokens only
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
        };
      }

      // If a previous refresh already failed, don't retry — surface the error
      if (token.error === 'RefreshAccessTokenError') {
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error;
      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    error?: string;
  }

  interface User extends Omit<import('@/types').User, 'id'> {
    id: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    user?: import('@/types').User;
    error?: string;
  }
}
