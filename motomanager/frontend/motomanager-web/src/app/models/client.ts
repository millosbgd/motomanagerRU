export interface Client {
  id: number;
  name: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
}

export interface CreateClientRequest {
  name: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface UpdateClientRequest {
  name: string;
  address?: string;
  city?: string;
  country?: string;
  isActive: boolean;
}
