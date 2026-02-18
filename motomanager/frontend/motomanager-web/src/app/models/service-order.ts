export type ServiceOrderStatus = 'Open' | 'InProgress' | 'Closed';

export interface ServiceOrder {
  id: number;
  vehicleId: number;
  description: string;
  status: ServiceOrderStatus;
  openedAt: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceOrderRequest {
  vehicleId: number;
  description: string;
}
