import { cookies } from 'next/headers';
import { ApiResponse, BASE_URL } from '@/lib/api/shared.api';
import { User, Workspace } from '@/types';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken && !refreshToken) return null;

  try {
    if (accessToken) {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        const userResponse: ApiResponse<User> = await res.json();
        return 'data' in userResponse ? userResponse.data : null;
      }
    }

    if (refreshToken) {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (refreshRes.ok) {
        const newTokens: ApiResponse<{
          accessToken: string;
          refreshToken: string;
        }> = await refreshRes.json();

        if (!('data' in newTokens)) return null;

        const userRes = await fetch(`${BASE_URL}/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newTokens.data.accessToken}`,
          },
        });

        if (userRes.ok) {
          const data: ApiResponse<{ user: User }> = await userRes.json();
          return 'data' in data ? data.data.user : null;
        }
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function getWorkspaces(): Promise<Workspace[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  if (!accessToken) {
    return [];
  }

  try {
    const res = await fetch(`${BASE_URL}/workspaces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      const data = (await res.json()) as ApiResponse<Workspace[]>;
      return 'data' in data ? data.data : [];
    }

    return [];
  } catch (error) {
    console.error('Error fetching workspaces:', error);
    return [];
  }
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('accessToken')?.value || null;
}
