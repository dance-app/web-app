import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { Figure, FigureVisibility } from '@/types';

const mockMarketplaceFigures: Figure[] = [
  {
    id: 'mp1',
    name: 'Cuban Motion Basics',
    description: 'Learn the fundamental Cuban motion that forms the foundation of all Latin dances. This figure teaches proper hip movement and weight transfer.',
    metadata: {
      videoUrls: ['https://example.com/cuban-motion.mp4'],
      photoUrls: ['https://example.com/cuban-motion.jpg'],
      difficulty: 1,
      tags: ['basic', 'cuban-motion', 'foundation'],
      estimatedLearningTime: 20,
    },
    visibility: FigureVisibility.PUBLIC,
    createdById: 'instructor1',
    workspaceId: 'global',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'mp2',
    name: 'Dile Que No',
    description: 'The classic "tell her no" move in salsa. A fundamental pattern that every salsa dancer should master.',
    metadata: {
      videoUrls: ['https://example.com/dile-que-no.mp4'],
      photoUrls: ['https://example.com/dile-que-no1.jpg', 'https://example.com/dile-que-no2.jpg'],
      difficulty: 2,
      tags: ['salsa', 'basic', 'pattern'],
      estimatedLearningTime: 25,
    },
    visibility: FigureVisibility.PUBLIC,
    createdById: 'instructor2',
    workspaceId: 'global',
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z',
  },
  {
    id: 'mp3',
    name: 'Bachata Side Step',
    description: 'The characteristic side step that defines bachata dancing. Learn the proper technique and styling.',
    metadata: {
      videoUrls: ['https://example.com/bachata-side-step.mp4'],
      difficulty: 2,
      tags: ['bachata', 'basic', 'side-step'],
      estimatedLearningTime: 15,
    },
    visibility: FigureVisibility.PUBLIC,
    createdById: 'instructor3',
    workspaceId: 'global',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'mp4',
    name: 'Advanced Rueda Combo',
    description: 'A complex rueda combination for experienced dancers. Includes multiple partner changes and intricate timing.',
    metadata: {
      videoUrls: ['https://example.com/rueda-combo.mp4'],
      photoUrls: ['https://example.com/rueda1.jpg'],
      difficulty: 5,
      tags: ['rueda', 'advanced', 'combo'],
      estimatedLearningTime: 90,
    },
    visibility: FigureVisibility.PUBLIC,
    createdById: 'instructor1',
    workspaceId: 'global',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
];

export async function GET(request: NextRequest) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search') || '';
    const difficulty = url.searchParams.get('difficulty');
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean) || [];
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    await new Promise(resolve => setTimeout(resolve, 600));

    let filteredFigures = mockMarketplaceFigures.filter(figure => 
      figure.visibility === FigureVisibility.PUBLIC
    );

    if (search) {
      filteredFigures = filteredFigures.filter(figure =>
        figure.name.toLowerCase().includes(search.toLowerCase()) ||
        figure.description.toLowerCase().includes(search.toLowerCase()) ||
        figure.metadata?.tags?.some(tag => 
          tag.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    if (difficulty) {
      const difficultyNum = parseInt(difficulty);
      filteredFigures = filteredFigures.filter(figure =>
        figure.metadata?.difficulty === difficultyNum
      );
    }

    if (tags.length > 0) {
      filteredFigures = filteredFigures.filter(figure =>
        figure.metadata?.tags?.some(tag => 
          tags.some(filterTag => tag.toLowerCase() === filterTag.toLowerCase())
        )
      );
    }

    const paginatedFigures = filteredFigures.slice(offset, offset + limit);

    return NextResponse.json({
      figures: paginatedFigures,
      total: filteredFigures.length,
      hasMore: offset + limit < filteredFigures.length
    });
  } catch (error) {
    console.error('GET /api/marketplace/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, response } = await validateOrRefreshToken();
    
    if (response) {
      return response;
    }

    if (!accessToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { figureId, workspaceId } = body;

    if (!figureId || !workspaceId) {
      return NextResponse.json({ 
        error: 'Figure ID and workspace ID are required' 
      }, { status: 400 });
    }

    await new Promise(resolve => setTimeout(resolve, 500));

    const marketplaceFigure = mockMarketplaceFigures.find(f => f.id === figureId);
    
    if (!marketplaceFigure) {
      return NextResponse.json({ error: 'Figure not found' }, { status: 404 });
    }

    const copiedFigure: Figure = {
      ...marketplaceFigure,
      id: `copied_${Date.now()}`,
      workspaceId: workspaceId,
      visibility: FigureVisibility.PRIVATE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ figure: copiedFigure });
  } catch (error) {
    console.error('POST /api/marketplace/figures error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}