import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateVehicleRequest, Vehicle } from '../models/vehicle';
import { CreateServiceOrderRequest, ServiceOrder } from '../models/service-order';
import { CodebookEntry, CreateCodebookEntryRequest, UpdateCodebookEntryRequest } from '../models/codebook-entry';
import { BehaviorSubject, Observable, retry, tap, timer } from 'rxjs';

const RETRY_CONFIG = {
  count: 3,
  delay: (_: any, retryCount: number) => timer(retryCount * 2000)
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minuta

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.API_BASE_URL;

  private vehiclesCache$ = new BehaviorSubject<Vehicle[] | null>(null);
  private vehiclesCachedAt = 0;

  private ordersCache$ = new BehaviorSubject<ServiceOrder[] | null>(null);
  private ordersCachedAt = 0;

  constructor(private http: HttpClient) {}

  getVehicles(): Observable<Vehicle[]> {
    const cached = this.vehiclesCache$.value;
    if (cached && Date.now() - this.vehiclesCachedAt < CACHE_TTL_MS) {
      return new Observable(obs => { obs.next(cached); obs.complete(); });
    }
    return this.http.get<Vehicle[]>(`${this.baseUrl}/api/vehicles`).pipe(
      retry(RETRY_CONFIG),
      tap(data => { this.vehiclesCache$.next(data); this.vehiclesCachedAt = Date.now(); })
    );
  }

  invalidateVehicles() { this.vehiclesCachedAt = 0; }

  createVehicle(request: CreateVehicleRequest) {
    return this.http.post<Vehicle>(`${this.baseUrl}/api/vehicles`, request).pipe(
      tap(() => this.invalidateVehicles())
    );
  }

  getServiceOrders(): Observable<ServiceOrder[]> {
    const cached = this.ordersCache$.value;
    if (cached && Date.now() - this.ordersCachedAt < CACHE_TTL_MS) {
      return new Observable(obs => { obs.next(cached); obs.complete(); });
    }
    return this.http.get<ServiceOrder[]>(`${this.baseUrl}/api/service-orders`).pipe(
      retry(RETRY_CONFIG),
      tap(data => { this.ordersCache$.next(data); this.ordersCachedAt = Date.now(); })
    );
  }

  invalidateOrders() { this.ordersCachedAt = 0; }

  createServiceOrder(request: CreateServiceOrderRequest) {
    return this.http.post<ServiceOrder>(`${this.baseUrl}/api/service-orders`, request).pipe(
      tap(() => this.invalidateOrders())
    );
  }

  closeServiceOrder(id: number) {
    return this.http.post<ServiceOrder>(`${this.baseUrl}/api/service-orders/${id}/close`, {}).pipe(
      tap(() => this.invalidateOrders())
    );
  }

  getCodebook() {
    return this.http.get<CodebookEntry[]>(`${this.baseUrl}/api/codebook`);
  }

  getCodebookByEntity(entity: string) {
    return this.http.get<CodebookEntry[]>(`${this.baseUrl}/api/codebook/${entity}`);
  }

  createCodebookEntry(request: CreateCodebookEntryRequest) {
    return this.http.post<CodebookEntry>(`${this.baseUrl}/api/codebook`, request);
  }

  updateCodebookEntry(id: number, request: UpdateCodebookEntryRequest) {
    return this.http.put<CodebookEntry>(`${this.baseUrl}/api/codebook/${id}`, request);
  }

  deleteCodebookEntry(id: number) {
    return this.http.delete(`${this.baseUrl}/api/codebook/${id}`);
  }
}
