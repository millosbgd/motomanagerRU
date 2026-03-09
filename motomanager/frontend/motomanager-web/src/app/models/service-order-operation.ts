export interface ServiceOrderOperation {
  id: number;
  serviceOrderId: number;
  serviceOperationId: number;
  operationName: string;
  workHours: number;
  pricePerHour: number;
  totalPrice: number;
}

export interface AddServiceOrderOperationRequest {
  serviceOperationId: number;
  workHours: number;
  pricePerHour: number;
}

export interface UpdateServiceOrderOperationRequest {
  workHours: number;
  pricePerHour: number;
}
