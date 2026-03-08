import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateVehicleRequest, Vehicle, UpdateVehicleRequest } from '../models/vehicle';
import { CreateServiceOrderRequest, ServiceOrder } from '../models/service-order';
import { CodebookEntry, CreateCodebookEntryRequest, UpdateCodebookEntryRequest } from '../models/codebook-entry';
import { Client, CreateClientRequest, UpdateClientRequest } from '../models/client';
import { ServiceActivity, CreateServiceActivityRequest, UpdateServiceActivityRequest } from '../models/service-activity';
import { Material, CreateMaterialRequest, UpdateMaterialRequest, UnitOfMeasure, CreateUnitOfMeasureRequest, UpdateUnitOfMeasureRequest, ServiceOperation, CreateServiceOperationRequest, UpdateServiceOperationRequest } from '../models/material';
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

  updateVehicle(id: number, request: UpdateVehicleRequest) {
    return this.http.put<Vehicle>(`${this.baseUrl}/api/vehicles/${id}`, request).pipe(
      tap(() => this.invalidateVehicles())
    );
  }

  deleteVehicle(id: number) {
    return this.http.delete(`${this.baseUrl}/api/vehicles/${id}`).pipe(
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

  getClients() {
    return this.http.get<Client[]>(`${this.baseUrl}/api/clients`);
  }

  createClient(request: CreateClientRequest) {
    return this.http.post<Client>(`${this.baseUrl}/api/clients`, request);
  }

  updateClient(id: number, request: UpdateClientRequest) {
    return this.http.put<Client>(`${this.baseUrl}/api/clients/${id}`, request);
  }

  deleteClient(id: number) {
    return this.http.delete(`${this.baseUrl}/api/clients/${id}`);
  }

  // ─── Servisne aktivnosti ───────────────────────────────────

  getServiceActivities() {
    return this.http.get<ServiceActivity[]>(`${this.baseUrl}/api/service-activities`);
  }

  createServiceActivity(request: CreateServiceActivityRequest) {
    return this.http.post<ServiceActivity>(`${this.baseUrl}/api/service-activities`, request);
  }

  updateServiceActivity(id: number, request: UpdateServiceActivityRequest) {
    return this.http.put<ServiceActivity>(`${this.baseUrl}/api/service-activities/${id}`, request);
  }

  deleteServiceActivity(id: number) {
    return this.http.delete(`${this.baseUrl}/api/service-activities/${id}`);
  }

  getActivitiesByOrder(serviceOrderId: number) {
    return this.http.get<ServiceActivity[]>(`${this.baseUrl}/api/service-orders/${serviceOrderId}/activities`);
  }

  addActivityToOrder(serviceOrderId: number, serviceActivityId: number) {
    return this.http.post(`${this.baseUrl}/api/service-orders/${serviceOrderId}/activities/${serviceActivityId}`, {});
  }

  removeActivityFromOrder(serviceOrderId: number, serviceActivityId: number) {
    return this.http.delete(`${this.baseUrl}/api/service-orders/${serviceOrderId}/activities/${serviceActivityId}`);
  }

  // ─── Jedinice mere ────────────────────────────────────────

  getUnitsOfMeasure() {
    return this.http.get<UnitOfMeasure[]>(`${this.baseUrl}/api/units-of-measure`);
  }

  createUnitOfMeasure(request: CreateUnitOfMeasureRequest) {
    return this.http.post<UnitOfMeasure>(`${this.baseUrl}/api/units-of-measure`, request);
  }

  updateUnitOfMeasure(id: number, request: UpdateUnitOfMeasureRequest) {
    return this.http.put<UnitOfMeasure>(`${this.baseUrl}/api/units-of-measure/${id}`, request);
  }

  deleteUnitOfMeasure(id: number) {
    return this.http.delete(`${this.baseUrl}/api/units-of-measure/${id}`);
  }

  // ─── Materijali ───────────────────────────────────────────

  getMaterials() {
    return this.http.get<Material[]>(`${this.baseUrl}/api/materials`);
  }

  createMaterial(request: CreateMaterialRequest) {
    return this.http.post<Material>(`${this.baseUrl}/api/materials`, request);
  }

  updateMaterial(id: number, request: UpdateMaterialRequest) {
    return this.http.put<Material>(`${this.baseUrl}/api/materials/${id}`, request);
  }

  deleteMaterial(id: number) {
    return this.http.delete(`${this.baseUrl}/api/materials/${id}`);
  }

  getServiceOperations() {
    return this.http.get<ServiceOperation[]>(`${this.baseUrl}/api/service-operations`);
  }

  createServiceOperation(request: CreateServiceOperationRequest) {
    return this.http.post<ServiceOperation>(`${this.baseUrl}/api/service-operations`, request);
  }

  updateServiceOperation(id: number, request: UpdateServiceOperationRequest) {
    return this.http.put<ServiceOperation>(`${this.baseUrl}/api/service-operations/${id}`, request);
  }

  deleteServiceOperation(id: number) {
    return this.http.delete(`${this.baseUrl}/api/service-operations/${id}`);
  }
}
