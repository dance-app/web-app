import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { BASE_URL } from '@/lib/api/shared.api';
import type { User } from '@/types';
import { MockApi, logMockDataUsage } from '@/lib/mock-api';

async function refreshAccessToken(token: any) {
  try {
    // Check if we should use mock data
    const mockResponse = await MockApi.refreshTokens();
    if (mockResponse) {
      logMockDataUsage('POST /auth/refresh-token (NextAuth)');
      return {
        ...token,
        accessToken: mockResponse.accessToken,
        accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
        refreshToken: mockResponse.refreshToken ?? token.refreshToken, // Fall back to old refresh token
      };
    }

    const response = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: token.refreshToken,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.accessToken,
      accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
      refreshToken: refreshedTokens.refreshToken ?? token.refreshToken, // Fall back to old refresh token
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
          // Check if we should use mock data
          const mockResponse = await MockApi.signIn({
            email: credentials?.email || '',
            password: credentials?.password || '',
          });
          
          if (mockResponse) {
            logMockDataUsage('POST /auth/sign-in (NextAuth)');
            // Return user object with tokens, using your existing User type structure
            return {
              ...mockResponse.user,
              accessToken: mockResponse.accessToken,
              refreshToken: mockResponse.refreshToken,
            };
          }

          const res = await fetch(`${BASE_URL}/auth/sign-in`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();
          console.log('Sign-in response:', data);

          if (!res.ok || data.error) {
            throw new Error(data.error || 'Authentication failed');
          }

          // Return user object with tokens, using your existing User type structure
          return {
            ...data.user,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000, // 15 minutes from now
          user,
        };
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      // Send properties to the client using your existing User type
      if (token.user) {
        session.accessToken = token.accessToken as string;
        session.user = token.user;
        session.error = token.error;
      }
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
    user: User;
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
