import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, ApiResponse } from '@/lib/api/shared.api';
import { User } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as
      | { email: string; password: string }
      | {};

    if (!('email' in payload) || !('password' in payload)) {
      throw new Error('Email and password are required');
    }

    const res = await fetch(`${BASE_URL}/auth/sign-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Invalid credentials');
    }

    const data: ApiResponse<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }> = await res.json();

    if (!('user' in data)) {
      throw new Error('Invalid response from sign-in');
    }

    const response = NextResponse.json({ user: data.user }, { status: 200 });

    //   // Set Access Token Cookie
    response.cookies.set('accessToken', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60, // 1 hour
    });

    //   // Set Refresh Token Cookie
    response.cookies.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 365 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
