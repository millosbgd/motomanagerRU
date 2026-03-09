export interface ServiceOrderMaterial {
  id: number;
  serviceOrderId: number;
  materialId: number;
  materialName: string;
  unitOfMeasureName?: string;
  quantity: number;
  pricePerUnit: number;
  totalPrice: number;
}

export interface AddServiceOrderMaterialRequest {
  materialId: number;
  quantity: number;
  pricePerUnit: number;
}

export interface UpdateServiceOrderMaterialRequest {
  quantity: number;
  pricePerUnit: number;
}
