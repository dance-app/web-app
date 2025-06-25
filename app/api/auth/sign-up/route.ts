import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, ApiResponse } from '@/lib/api/shared.api';
import { User } from '@/types';
import { setAuthCookies } from '@/lib/auth/set-tokens';
import { MockApi, logMockDataUsage } from '@/lib/mock-api';

function validateSignupPayload(payload: any): payload is {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} {
  return (
    typeof payload?.email === 'string' &&
    typeof payload?.password === 'string' &&
    typeof payload?.firstName === 'string' &&
    typeof payload?.lastName === 'string'
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!validateSignupPayload(body)) {
      return NextResponse.json(
        {
          error:
            'All fields (email, password, first name, last name) are required',
        },
        { status: 400 }
      );
    }

    // Check if we should use mock data
    try {
      const mockResponse = await MockApi.signUp(body);
      if (mockResponse) {
        logMockDataUsage('POST /api/auth/sign-up');
        const response = NextResponse.json({ user: mockResponse.user });
        setAuthCookies(response, {
          accessToken: mockResponse.accessToken,
          refreshToken: mockResponse.refreshToken,
        });
        return response;
      }
    } catch (mockError: any) {
      return NextResponse.json(
        { error: mockError.message },
        { status: 400 }
      );
    }

    const res = await fetch(`${BASE_URL}/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(
        { error: error.message || 'Sign-up failed' },
        { status: 400 }
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
        { error: 'Invalid sign-up response' },
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
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
