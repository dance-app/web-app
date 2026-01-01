import { NextRequest, NextResponse } from 'next/server';
import { validateOrRefreshToken } from '@/lib/auth/validate-or-refresh';
import { Material, MaterialVisibility } from '@/types/material';
import { BASE_URL } from '@/lib/api/shared.api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { accessToken, response } = await validateOrRefreshToken();

    // if (response) return response;
    // if (!accessToken)
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { slug } = await params;
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    const apiResponse = await fetch(
      `${BASE_URL}/workspaces/${slug}/materials`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log('API Response:', apiResponse);
    console.log('Request URL:', `${BASE_URL}/workspaces/${slug}/materials`);
    console.log('Request Headers:', {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${accessToken}`,
    });
    if (!apiResponse.ok) {
      const errorResponse = await apiResponse.json();
      console.error('API Error:', errorResponse);
      return NextResponse.json(
        { message: errorResponse.message },
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();

    console.log('Fetched:', data);

    // Return the actual API data instead of mock data
    return NextResponse.json({
      materials: data.materials || data || [],
    });
  } catch (error) {
    console.error('GET /api/workspace/[slug]/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { accessToken, response } = await validateOrRefreshToken();

    // if (response) {
    //   return response;
    // }

    // if (!accessToken) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { slug: workspaceId } = await params;
    const body = await request.json();

    await new Promise((resolve) => setTimeout(resolve, 800));

    // const newMaterial: Material = {
    //   id: `${mockMaterials.length + 1}`,
    //   name: body.name || 'New Material',
    //   description: body.description || '',
    //   metadata: body.metadata || {},
    //   visibility: body.visibility || MaterialVisibility.PRIVATE,
    //   createdById: 'current-user-id',
    //   workspaceId: workspaceId,
    //   sharedWithWorkspaces: body.sharedWithWorkspaces || [],
    //   sharedWithUsers: body.sharedWithUsers || [],
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    // };

    // mockMaterials.push(newMaterial);

    return NextResponse.json({ material: null });
  } catch (error) {
    console.error('POST /api/workspace/[id]/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { accessToken, response } = await validateOrRefreshToken();

    // if (response) {
    //   return response;
    // }

    // if (!accessToken) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { slug: workspaceId } = await params;
    const body = await request.json();
    const { materialId, ...updateData } = body;

    await new Promise((resolve) => setTimeout(resolve, 600));

    const materialIndex = [].findIndex(
      (material: any) =>
        material.id === materialId && material.workspaceId === workspaceId
    );

    if (materialIndex === -1) {
      return NextResponse.json(
        { error: 'Material not found' },
        { status: 404 }
      );
    }

    const updatedMaterial = {
      // ...mockMaterials[materialIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    // mockMaterials[materialIndex] = updatedMaterial;

    return NextResponse.json({ material: updatedMaterial });
  } catch (error) {
    console.error('PUT /api/workspace/[id]/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // const { accessToken, response } = await validateOrRefreshToken();

    // if (response) {
    //   return response;
    // }

    // if (!accessToken) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { slug: workspaceId } = await params;
    const url = new URL(request.url);
    const materialId = url.searchParams.get('materialId');

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      );
    }

    await new Promise((resolve) => setTimeout(resolve, 400));

    // const materialIndex = mockMaterials.findIndex(
    //   (material) =>
    //     material.id === materialId && material.workspaceId === workspaceId
    // );

    // if (materialIndex === -1) {
    //   return NextResponse.json(
    //     { error: 'Material not found' },
    //     { status: 404 }
    //   );
    // }

    // mockMaterials.splice(materialIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/workspace/[id]/materials error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
