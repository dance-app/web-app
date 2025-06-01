import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BASE_URL } from '@/lib/api/shared.api';
import { slugify } from '@/lib/utils';
import { LocalApiResponse, Workspace } from '@/types';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    console.log('Access Token:', accessToken);
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

export type CreateWorkspaceResponse = LocalApiResponse<
  {
    workspace: Workspace;
  },
  'NAME_REQUIRED' | 'INVALID_NAME_LENGTH' | 'OWNER_ID_REQUIRED'
>;

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    console.log('Access Token:', accessToken);
    if (!accessToken)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const payload = await request.json();
    if (!payload.name) throw new Error('NAME_REQUIRED');
    if (payload.name.length < 3 || payload.name.length > 50)
      throw new Error('INVALID_NAME_LENGTH');
    if (!payload.ownerId) throw new Error('OWNER_ID_REQUIRED');

    const result = await fetch(`${BASE_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        slug: slugify(payload.name.trim()),
        ownerId: payload.ownerId,
      }),
    });
    const data: ApiResponse<Workspace> = await result.json();

    if ('message' in data)
      throw new Error(data.message || 'Failed to create workspace');

    const response: CreateWorkspaceResponse = {
      success: true,
      data: { workspace: data },
    };
    return NextResponse.json(response, { status: 201 });
  } catch (error: any) {
    console.error('Error accessing cookies:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
