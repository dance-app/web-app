import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api/shared.api';

async function fetchCurrentUser(accessToken: string) {
  try {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      return { message: 'Unauthorized' };
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return { message: 'Unauthorized' };
  }
}

async function refreshAccessToken(
  refreshToken: string
): Promise<{ accessToken?: string; refreshToken?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      return { error: 'Refresh token invalid' };
    }

    return await res.json();
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { error: 'Refresh token error' };
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  if (!accessToken) {
    return NextResponse.json(
      { user: null, message: 'No access token' },
      { status: 401 }
    );
  }

  let user = await fetchCurrentUser(accessToken);

  if ('message' in user && user.message === 'Unauthorized') {
    if (!refreshToken) {
      return NextResponse.json(
        { user: null, message: 'No refresh token' },
        { status: 401 }
      );
    }

    const refreshed = await refreshAccessToken(refreshToken);

    if ('error' in refreshed || !refreshed.accessToken) {
      return NextResponse.json(
        { user: null, message: 'Refresh failed' },
        { status: 401 }
      );
    }

    const response = NextResponse.next();
    response.cookies.set('accessToken', refreshed.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60,
    });

    if (refreshed.refreshToken) {
      response.cookies.set('refreshToken', refreshed.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    user = await fetchCurrentUser(refreshed.accessToken);

    if ('message' in user && user.message === 'Unauthorized') {
      return NextResponse.json(
        { user: null, message: 'Still unauthorized after refresh' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { user },
      { status: 200, headers: response.headers }
    );
  }

  return NextResponse.json({ user }, { status: 200 });
}
