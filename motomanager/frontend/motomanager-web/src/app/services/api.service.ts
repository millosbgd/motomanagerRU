import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateVehicleRequest, Vehicle } from '../models/vehicle';
import { CreateServiceOrderRequest, ServiceOrder } from '../models/service-order';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.API_BASE_URL;

  constructor(private http: HttpClient) {}

  getVehicles() {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/api/vehicles`);
  }

  createVehicle(request: CreateVehicleRequest) {
    return this.http.post<Vehicle>(`${this.baseUrl}/api/vehicles`, request);
  }

  getServiceOrders() {
    return this.http.get<ServiceOrder[]>(`${this.baseUrl}/api/service-orders`);
  }

  createServiceOrder(request: CreateServiceOrderRequest) {
    return this.http.post<ServiceOrder>(`${this.baseUrl}/api/service-orders`, request);
  }

  closeServiceOrder(id: number) {
    return this.http.post<ServiceOrder>(`${this.baseUrl}/api/service-orders/${id}/close`, {});
  }
}
