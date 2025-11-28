import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BASE_URL } from '@/lib/api/shared.api';
import { slugify } from '@/lib/utils';
import { LocalApiResponse, Workspace } from '@/types';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { MockApi, logMockDataUsage } from '@/lib/mock-api';

export async function GET() {
  try {
    const authResult = await validateOrRefreshToken();

    if (!authResult.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if we should use mock data
    const mockResponse = await MockApi.getWorkspaces();
    if (mockResponse) {
      logMockDataUsage('GET /api/workspace');
      return NextResponse.json({ workspaces: mockResponse }, { status: 200 });
    }

    const response = await fetch(`${BASE_URL}/workspaces`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authResult.accessToken}`,
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
    const result = NextResponse.json({ workspaces: data }, { status: 200 });

    // If we refreshed tokens, update cookies
    if (authResult.response) {
      authResult.response.headers.forEach((value, key) => {
        result.headers.set(key, value);
      });
    }

    return result;
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
    const authResult = await validateOrRefreshToken();

    if (!authResult.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const payload = await request.json();
    if (!payload.name) throw new Error('NAME_REQUIRED');
    if (payload.name.length < 3 || payload.name.length > 50)
      throw new Error('INVALID_NAME_LENGTH');
    if (!payload.ownerId) throw new Error('OWNER_ID_REQUIRED');

    // Check if we should use mock data
    const mockResponse = await MockApi.createWorkspace({
      name: payload.name.trim(),
      slug: slugify(payload.name.trim()),
    });
    if (mockResponse) {
      logMockDataUsage('POST /api/workspace');
      const responseData: CreateWorkspaceResponse = {
        success: true,
        data: { workspace: mockResponse },
      };
      return NextResponse.json(responseData, { status: 201 });
    }

    const result = await fetch(`${BASE_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authResult.accessToken}`,
      },
      body: JSON.stringify({
        name: payload.name.trim(),
        slug: slugify(payload.name.trim()),
        ownerId: payload.ownerId,
      }),
    });
    const data: ApiResponse<Workspace> = await result.json();

    if (!('data' in data)) {
      const message =
        (Array.isArray(data.message) ? data.message[0] : data.message) ||
        'Failed to create workspace';
      throw new Error(message);
    }

    const responseData: CreateWorkspaceResponse = {
      success: true,
      data: { workspace: data.data },
    };
    const response = NextResponse.json(responseData, { status: 201 });

    // If we refreshed tokens, update cookies
    if (authResult.response) {
      authResult.response.headers.forEach((value, key) => {
        response.headers.set(key, value);
      });
    }

    return response;
  } catch (error: any) {
    console.error('Error accessing cookies:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
