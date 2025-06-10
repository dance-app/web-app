import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { Figure, FigureVisibility } from '@/types';

const mockFigures: Figure[] = [
  {
    id: '1',
    name: 'Basic Turn',
    description: 'A fundamental turn in salsa dancing. The leader guides the follower through a complete 360-degree turn.',
    metadata: {
      videoUrls: ['https://example.com/video1.mp4'],
      photoUrls: ['https://example.com/photo1.jpg'],
      difficulty: 2,
      tags: ['basic', 'turn', 'fundamental'],
      estimatedLearningTime: 15,
    },
    visibility: FigureVisibility.PUBLIC,
    createdById: 'user1',
    workspaceId: '1',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Cross Body Lead',
    description: 'The cross body lead is one of the most important moves in salsa. It involves the follower crossing in front of the leader.',
    metadata: {
      videoUrls: ['https://example.com/video2.mp4'],
      photoUrls: ['https://example.com/photo2.jpg', 'https://example.com/photo2b.jpg'],
      difficulty: 3,
      tags: ['intermediate', 'cross-body', 'lead'],
      estimatedLearningTime: 30,
    },
    visibility: FigureVisibility.WORKSPACE_SHARED,
    createdById: 'user2',
    workspaceId: '1',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    name: 'Advanced Spin Combo',
    description: 'A complex combination of spins and turns for advanced dancers. Requires precise timing and coordination.',
    metadata: {
      videoUrls: ['https://example.com/video3.mp4'],
      difficulty: 5,
      tags: ['advanced', 'spin', 'combo'],
      estimatedLearningTime: 60,
    },
    visibility: FigureVisibility.PRIVATE,
    createdById: 'user1',
    workspaceId: '1',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;

    await new Promise(resolve => setTimeout(resolve, 500));

    const workspaceFigures = mockFigures.filter(figure => figure.workspaceId === workspaceId);

    return NextResponse.json({
      figures: workspaceFigures
    });
  } catch (error) {
    console.error('GET /api/workspace/[id]/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;
    const body = await request.json();

    await new Promise(resolve => setTimeout(resolve, 800));

    const newFigure: Figure = {
      id: `${mockFigures.length + 1}`,
      name: body.name || 'New Figure',
      description: body.description || '',
      metadata: body.metadata || {},
      visibility: body.visibility || FigureVisibility.PRIVATE,
      createdById: 'current-user-id',
      workspaceId: workspaceId,
      sharedWithWorkspaces: body.sharedWithWorkspaces || [],
      sharedWithUsers: body.sharedWithUsers || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockFigures.push(newFigure);

    return NextResponse.json({ figure: newFigure });
  } catch (error) {
    console.error('POST /api/workspace/[id]/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;
    const body = await request.json();
    const { figureId, ...updateData } = body;

    await new Promise(resolve => setTimeout(resolve, 600));

    const figureIndex = mockFigures.findIndex(
      figure => figure.id === figureId && figure.workspaceId === workspaceId
    );

    if (figureIndex === -1) {
      return NextResponse.json({ error: 'Figure not found' }, { status: 404 });
    }

    const updatedFigure = {
      ...mockFigures[figureIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    mockFigures[figureIndex] = updatedFigure;

    return NextResponse.json({ figure: updatedFigure });
  } catch (error) {
    console.error('PUT /api/workspace/[id]/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workspaceId = params.id;
    const url = new URL(request.url);
    const figureId = url.searchParams.get('figureId');

    if (!figureId) {
      return NextResponse.json({ error: 'Figure ID is required' }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 400));

    const figureIndex = mockFigures.findIndex(
      figure => figure.id === figureId && figure.workspaceId === workspaceId
    );

    if (figureIndex === -1) {
      return NextResponse.json({ error: 'Figure not found' }, { status: 404 });
    }

    mockFigures.splice(figureIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/workspace/[id]/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}