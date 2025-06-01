import { NextRequest, NextResponse } from 'next/server';
import { BASE_URL, ApiResponse } from '@/lib/api/shared.api';
import { LocalApiResponse } from '@/types';

export type VerifyEmailResponse = LocalApiResponse<
  {
    message: string;
  },
  'INVALID_OR_EXPIRED_TOKEN'
>;

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as
      | {
          token: string;
        }
      | {};

    if (!('token' in payload)) throw new Error('token is required');

    const res = await fetch(`${BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Error during verify email');
    }
    const data: ApiResponse<{ message: string }> = await res.json();
    if (!('message' in data)) throw new Error('Invalid response from sign-in');
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    const response: VerifyEmailResponse = {
      success: false,
      error: {
        message: 'INVALID_OR_EXPIRED_TOKEN',
      },
      statusCode: 401,
    };
    return NextResponse.json(response, { status: 401 });
  }
}
