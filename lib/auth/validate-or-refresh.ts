import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api/shared.api';
import { setAuthCookies } from './set-tokens';

interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

async function refreshTokens(
  refreshToken: string
): Promise<RefreshTokenResponse | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function validateToken(accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function validateOrRefreshToken(): Promise<{
  accessToken: string | null;
  response?: NextResponse;
  error?: boolean;
}> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  // No tokens at all
  if (!accessToken && !refreshToken) {
    return { accessToken: null, error: true };
  }

  // Try access token first
  if (accessToken) {
    const isValid = await validateToken(accessToken);
    if (isValid) {
      return { accessToken };
    }
  }

  // Access token invalid/missing, try refresh
  if (refreshToken) {
    const newTokens = await refreshTokens(refreshToken);
    if (newTokens?.accessToken) {
      const response = new NextResponse();
      setAuthCookies(response, {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      });

      return {
        accessToken: newTokens.accessToken,
        response,
      };
    }
  }

  // Both tokens failed
  return { accessToken: null, error: true };
}
