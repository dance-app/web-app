import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ApiResponse, BASE_URL } from '@/lib/api/shared.api';
import { setAuthCookies } from '@/lib/auth/set-tokens';
import { User } from '@/types';

async function fetchCurrentUser(accessToken: string) {
  const res = await fetch(`${BASE_URL}/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) return null;
  const data: ApiResponse<{
    user: User;
  }> = await res.json();

  return data;
}

async function refreshTokens(refreshToken: string) {
  const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;
  return res.json();
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (accessToken) {
    const user = await fetchCurrentUser(accessToken);
    if (user) return NextResponse.json({ user });
  }

  if (refreshToken) {
    const newTokens = await refreshTokens(refreshToken);

    if (newTokens?.accessToken) {
      // Try fetching user again with new token
      const user = await fetchCurrentUser(newTokens.accessToken);
      if (user) {
        const response = NextResponse.json({ user });
        setAuthCookies(response, {
          accessToken: newTokens.accessToken,
          refreshToken: newTokens.refreshToken,
        });

        return response;
      }
    }
  }

  return NextResponse.json(
    { user: null, message: 'Unauthorized' },
    { status: 401 }
  );
}
