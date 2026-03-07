export interface Vehicle {
  id: number;
  registration: string;
  make: string;
  model: string;
  year?: number;
  isActive: boolean;
  clientId?: number;
  clientName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  registration: string;
  make: string;
  model: string;
  year?: number;
  clientId?: number;
}

export interface UpdateVehicleRequest {
  registration: string;
  make: string;
  model: string;
  year?: number;
  isActive: boolean;
  clientId?: number;
}
