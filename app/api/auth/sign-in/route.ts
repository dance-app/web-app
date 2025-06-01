import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, ApiResponse } from '@/lib/api/shared.api';
import { User } from '@/types';
import { setAuthCookies } from '@/lib/auth/set-tokens';

function validatePayload(
  payload: any
): payload is { email: string; password: string } {
  return (
    typeof payload?.email === 'string' && typeof payload?.password === 'string'
  );
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();

    if (!validatePayload(payload))
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );

    const res = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || 'Invalid credentials' },
        { status: 401 }
      );
    }

    const data: ApiResponse<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }> = await res.json();

    if (
      !('user' in data) ||
      !('accessToken' in data) ||
      !('refreshToken' in data)
    ) {
      return NextResponse.json(
        { error: 'Invalid sign-in response' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ user: data.user });
    setAuthCookies(response, {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    return response;
  } catch (error: any) {
    console.error('Sign-in error:', error);
    return NextResponse.json(
      { error: 'Something went wrong during sign-in' },
      { status: 500 }
    );
  }
}
