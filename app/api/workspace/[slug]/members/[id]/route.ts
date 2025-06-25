import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { MockApi, logMockDataUsage } from '@/lib/mock-api';
import { LocalApiResponse, Member } from '@/types';

export type UpdateMemberResponse = LocalApiResponse<
  {
    member: Member;
  },
  'MEMBER_NOT_FOUND' | 'INVALID_DATA' | 'WORKSPACE_NOT_FOUND'
>;

export type DeleteMemberResponse = LocalApiResponse<
  {
    member: Member;
  },
  'MEMBER_NOT_FOUND' | 'WORKSPACE_NOT_FOUND'
>;

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const authResult = await validateOrRefreshToken();

    if (!authResult.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug: workspaceSlug, id: memberId } = await params;
    const body = await request.json();

    // Check if we should use mock data
    const mockResponse = await MockApi.updateMember(workspaceSlug, memberId, body);
    if (mockResponse) {
      logMockDataUsage(`PUT /api/workspace/${workspaceSlug}/members/${memberId}`);
      if (mockResponse.success) {
        const responseData: UpdateMemberResponse = {
          success: true,
          data: { member: mockResponse.data },
        };
        return NextResponse.json(responseData, { status: 200 });
      } else {
        return NextResponse.json(
          { message: mockResponse.error.message },
          { status: mockResponse.statusCode }
        );
      }
    }

    // TODO: Implement real API call when backend is available
    return NextResponse.json(
      { message: 'Member update not implemented for real API yet' },
      { status: 501 }
    );
  } catch (error: any) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; id: string } }
) {
  try {
    const authResult = await validateOrRefreshToken();

    if (!authResult.accessToken) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { slug: workspaceSlug, id: memberId } = await params;

    // Check if we should use mock data
    const mockResponse = await MockApi.deleteMember(workspaceSlug, memberId);
    if (mockResponse) {
      logMockDataUsage(`DELETE /api/workspace/${workspaceSlug}/members/${memberId}`);
      if (mockResponse.success) {
        const responseData: DeleteMemberResponse = {
          success: true,
          data: { member: mockResponse.data },
        };
        return NextResponse.json(responseData, { status: 200 });
      } else {
        return NextResponse.json(
          { message: mockResponse.error.message },
          { status: mockResponse.statusCode }
        );
      }
    }

    // TODO: Implement real API call when backend is available
    return NextResponse.json(
      { message: 'Member delete not implemented for real API yet' },
      { status: 501 }
    );
  } catch (error: any) {
    console.error('Error deleting member:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}