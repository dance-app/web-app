import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { Material, MaterialVisibility } from '@/types/material';

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

    await new Promise((resolve) => setTimeout(resolve, 600));

    let filteredMaterials = ([] as any).filter(
      (material: any) => material.visibility === MaterialVisibility.PUBLIC
    );

    if (search) {
      filteredMaterials = filteredMaterials.filter(
        (material: any) =>
          material.name.toLowerCase().includes(search.toLowerCase()) ||
          material.description.toLowerCase().includes(search.toLowerCase()) ||
          material.metadata?.tags?.some((tag: any) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    if (difficulty) {
      const difficultyNum = parseInt(difficulty);
      filteredMaterials = filteredMaterials.filter(
        (material: any) => material.metadata?.difficulty === difficultyNum
      );
    }

    if (tags.length > 0) {
      filteredMaterials = filteredMaterials.filter(
        (material: any) =>
          material.metadata?.tags?.some((tag: any) =>
            tags.some(
              (filterTag) => tag.toLowerCase() === filterTag.toLowerCase()
            )
          )
      );
    }

    const paginatedMaterials = filteredMaterials.slice(offset, offset + limit);

    return NextResponse.json({
      materials: paginatedMaterials,
      total: filteredMaterials.length,
      hasMore: offset + limit < filteredMaterials.length,
    });
  } catch (error) {
    console.error('GET /api/marketplace/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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
    const { materialId, workspaceId } = body;

    if (!materialId || !workspaceId) {
      return NextResponse.json(
        {
          error: 'Material ID and workspace ID are required',
        },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const marketplaceMaterial = [].find((m: any) => m.id === materialId);

    if (!marketplaceMaterial) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    const copiedMaterial: any = {
      // ...marketplaceMaterial,
      id: 45,
      workspaceId: workspaceId,
      visibility: MaterialVisibility.PRIVATE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ material: copiedMaterial });
  } catch (error) {
    console.error('POST /api/marketplace/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
