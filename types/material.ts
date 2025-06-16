import { DanceType } from './dance';

interface CreatedBy {
  id: number;
  firstName: string;
  lastName: string;
}

interface ChildMaterial {
  id: number;
  name: string;
}

interface ParentMaterial {
  id: number;
  name: string;
}

export enum MaterialVisibility {
  PRIVATE = 'PRIVATE',
  WORKSPACE = 'WORKSPACE',
  PUBLIC = 'PUBLIC',
}

export interface Material {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  description: string;
  videoUrls: string[];
  imageUrls: string[];
  visibility: MaterialVisibility;
  workspaceId: number | null;
  parentMaterialId: number | null;
  danceTypeId: number | null;
  createdBy: CreatedBy;
  workspace: any | null;
  parentMaterial: ParentMaterial | null;
  childMaterials: ChildMaterial[];
  danceType: DanceType | null;
}

interface Meta {
  totalCount: number;
  count: number;
  page: number;
  pages: number;
  limit: number;
  offset: number;
}

export interface MaterialsResponse {
  materials: {
    data: Material[];
    meta: Meta;
  };
}
