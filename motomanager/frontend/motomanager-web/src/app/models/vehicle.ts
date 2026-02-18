export interface Vehicle {
  id: number;
  registration: string;
  make: string;
  model: string;
  year?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  registration: string;
  make: string;
  model: string;
  year?: number;
}
