import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { BASE_URL } from '@/lib/api/shared.api';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetch(`${BASE_URL}/workspaces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      return NextResponse.json(
        { message: errorResponse.message },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ workspaces: data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
