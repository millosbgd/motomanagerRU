export type ServiceOrderStatus = 'Open' | 'InProgress' | 'Closed';

export interface ServiceOrder {
  id: number;
  vehicleId: number;
  description: string;
  status: ServiceOrderStatus;
  date: string;
  mileage: number;
  openedAt: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceOrderRequest {
  vehicleId: number;
  description: string;
  date: string;
  mileage: number;
}

export interface UpdateServiceOrderRequest {
  description: string;
  status: ServiceOrderStatus;
  date: string;
  mileage: number;
}
