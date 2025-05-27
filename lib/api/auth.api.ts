import { fetcher, type ApiResponse } from '@/lib/api/shared.api';
import { User } from '@/types';

export const auth = {
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return fetcher('/auth/me', { method: 'GET' });
  },

  async signIn({ email, password }: { email: string; password: string }) {
    return fetcher<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/sign-in', {
      method: 'POST',
      body: { email, password },
    });
  },

  // async signUp(
  //   name: string,
  //   email: string,
  //   password: string
  // ): Promise<{ user: User }> {
  //   await delay(1000);
  //   return {
  //     user: {
  //       id: Math.random().toString(36).substring(2, 9),
  //       email,
  //       name,
  //     },
  //   };
  // },
};
