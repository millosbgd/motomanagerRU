export interface Material {
  id: number;
  name: string;
  unitOfMeasureId: number;
  unitOfMeasureName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialRequest {
  name: string;
  unitOfMeasureId: number;
}

export interface UpdateMaterialRequest {
  name: string;
  unitOfMeasureId: number;
  isActive: boolean;
}

export interface UnitOfMeasure {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUnitOfMeasureRequest {
  name: string;
}

export interface UpdateUnitOfMeasureRequest {
  name: string;
  isActive: boolean;
}
