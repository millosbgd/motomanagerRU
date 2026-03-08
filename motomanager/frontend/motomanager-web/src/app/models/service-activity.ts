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
