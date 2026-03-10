export interface ServiceActivity {
  id: number;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceActivityRequest {
  name: string;
}

export interface UpdateServiceActivityRequest {
  name: string;
  isActive: boolean;
}

export interface ServiceActivityDefaultOperation {
  id: number;
  serviceActivityId: number;
  serviceOperationId: number;
  operationName: string;
  workHours: number;
}

export interface AddServiceActivityDefaultOperationRequest {
  serviceOperationId: number;
  workHours: number;
}

export interface UpdateServiceActivityDefaultOperationRequest {
  workHours: number;
}

export interface ServiceActivityDefaultMaterial {
  id: number;
  serviceActivityId: number;
  materialId: number;
  materialName: string;
  unitOfMeasureName?: string;
  quantity: number;
}

export interface AddServiceActivityDefaultMaterialRequest {
  materialId: number;
  quantity: number;
}

export interface UpdateServiceActivityDefaultMaterialRequest {
  quantity: number;
}
