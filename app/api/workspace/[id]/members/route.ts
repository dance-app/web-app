import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, BASE_URL } from '@/lib/api/shared.api';
import { LocalApiResponse, Member, Workspace, WorkspaceRole } from '@/types';

export type GetWorkspaceMembersResponse = LocalApiResponse<
  {
    members: Member[];
  },
  'NAME_REQUIRED' | 'INVALID_NAME_LENGTH' | 'OWNER_ID_REQUIRED'
>;

const now = new Date();
const fakeMembers: Member[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    createdAt: now,
    updatedAt: now,
    createdById: 'system',
    user: null,
    roles: [WorkspaceRole.STUDENT],
  },
  {
    id: '2',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    createdAt: now,
    updatedAt: now,
    createdById: 'system',
    user: null,
    roles: [WorkspaceRole.STUDENT],
  },
  {
    id: '3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    createdAt: now,
    updatedAt: now,
    createdById: 'system',
    user: null,
    roles: [WorkspaceRole.STUDENT],
  },
  {
    id: '4',
    name: 'David Martinez',
    email: 'david.martinez@example.com',
    createdAt: now,
    updatedAt: now,
    createdById: 'system',
    user: null,
    roles: [WorkspaceRole.STUDENT],
  },
  {
    id: '5',
    name: 'Eve Thompson',
    email: 'eve.thompson@example.com',
    createdAt: now,
    updatedAt: now,
    createdById: 'system',
    user: null,
    roles: [WorkspaceRole.STUDENT],
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    // console.log('Access Token:', accessToken);
    if (!accessToken)
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    const { id: workspaceId } = await params;
    // console.log('Workspace ID:', workspaceId);

    return NextResponse.json({ members: fakeMembers }, { status: 200 });
    // const response = await fetch(
    //   `${BASE_URL}/workspace/${workspaceId}/members`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${accessToken}`,
    //     },
    //   }
    // );

    // if (!response.ok) {
    //   const errorResponse = await response.json();
    //   return NextResponse.json(
    //     { message: errorResponse.message },
    //     { status: response.status }
    //   );
    // }

    // const data = await response.json();
    // console.log('Members data:', data);

    // return NextResponse.json({ members: data }, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching workspaces:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
