import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { ServiceOrder } from '../models/service-order';
import { Vehicle } from '../models/vehicle';
import { ServiceActivity } from '../models/service-activity';

@Component({
  standalone: true,
  selector: 'app-service-orders',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule],
  template: `
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between;">
      <div>
        <h1>Servisni nalozi</h1>
        <p>Upravljanje servisnim nalozima po vozilima</p>
      </div>
      <button class="btn btn-primary" (click)="openModal()">
        <i class="pi pi-plus"></i> Novi nalog
      </button>
    </div>

    <div class="data-card">
      <div class="data-card-header">
      </div>
      <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
        <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
        <span>Učitavanje... (server se budi, može trajati do 60s)</span>
      </div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Vozilo</th>
            <th>Opis</th>
            <th>Status</th>
            <th>Otvoreno</th>
            <th>Aktivnosti</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="orders.length === 0" class="empty-row">
            <td colspan="7">
              <i class="pi pi-wrench" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema naloga.
            </td>
          </tr>
          <tr *ngFor="let o of orders">
            <td style="color:#475569; font-size:13px;">{{ o.id }}</td>
            <td><strong style="color:#f1f5f9;">{{ getRegistration(o.vehicleId) }}</strong></td>
            <td>{{ o.description }}</td>
            <td>
              <span class="badge"
                [class.badge-open]="o.status === 'Open'"
                [class.badge-inprogress]="o.status === 'InProgress'"
                [class.badge-closed]="o.status === 'Closed'">
                {{ statusLabel(o.status) }}
              </span>
            </td>
            <td style="color:#64748b; font-size:13px;">{{ o.openedAt | date:'dd.MM.yyyy' }}</td>
            <td>
              <button class="btn" style="padding:5px 12px; background:#1e3a5f; color:#7dd3fc; font-size:13px;" (click)="openActivitiesModal(o)">
                <i class="pi pi-list"></i> Aktivnosti
              </button>
            </td>
            <td>
              <button *ngIf="o.status !== 'Closed'" class="btn btn-success" (click)="close(o)">
                <i class="pi pi-check"></i> Zatvori
              </button>
              <span *ngIf="o.status === 'Closed'" style="color:#334155; font-size:12px;">Zatvoreno</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <p-dialog
      header="Novi servisni nalog"
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '480px'}"
      styleClass="dark-dialog">

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Vozilo *</label>
          <select formControlName="vehicleId"
            [class.error]="submitted && form.get('vehicleId')?.invalid"
            style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
            <option [ngValue]="null" disabled>Izaberi vozilo</option>
            <option *ngFor="let v of vehicles" [ngValue]="v.id">
              {{ v.registration }} &mdash; {{ v.make }} {{ v.model }}
            </option>
          </select>
          <span class="field-error" *ngIf="submitted && form.get('vehicleId')?.invalid">Izaberi vozilo</span>
        </div>
        <div class="form-field">
          <label>Opis radova *</label>
          <input formControlName="description" placeholder="npr. Zamena ulja i filtera"
            [class.error]="submitted && form.get('description')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('description')?.invalid">Obavezno polje</span>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
          <button type="button" class="btn" style="background:#334155; color:#94a3b8;" (click)="closeModal()">Otkaži</button>
          <button type="submit" class="btn btn-primary"><i class="pi pi-check"></i> Sačuvaj</button>
        </div>
      </form>
    </p-dialog>

    <!-- Modal: Aktivnosti naloga -->
    <p-dialog
      [header]="'Aktivnosti – nalog #' + (activeOrder?.id ?? '')"
      [(visible)]="activitiesModalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '520px'}"
      styleClass="dark-dialog"
      (onHide)="closeActivitiesModal()">

      <div style="padding:4px 0 16px;">

        <div *ngIf="orderActivitiesLoading" style="text-align:center; padding:16px; color:#64748b;">
          <i class="pi pi-spin pi-spinner"></i> Učitavanje...
        </div>

        <div *ngIf="!orderActivitiesLoading">
          <div *ngIf="orderActivities.length === 0" style="color:#475569; font-size:14px; padding:8px 0 16px;">
            Nema aktivnosti na ovom nalogu.
          </div>

          <div *ngFor="let a of orderActivities"
            style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#0f172a; border-radius:8px; margin-bottom:8px;">
            <span style="color:#e2e8f0; font-size:14px;">{{ a.name }}</span>
            <button class="btn" style="padding:4px 10px; background:#3b0f0f; color:#f87171; font-size:12px;" (click)="removeActivity(a.id)">
              <i class="pi pi-times"></i>
            </button>
          </div>

          <div style="display:flex; gap:8px; margin-top:16px; border-top:1px solid #1e293b; padding-top:16px;">
            <select [(ngModel)]="selectedActivityId"
              style="flex:1; background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none;">
              <option [ngValue]="null" disabled>Izaberi aktivnost...</option>
              <option *ngFor="let a of availableActivities" [ngValue]="a.id">{{ a.name }}</option>
            </select>
            <button class="btn btn-primary" [disabled]="!selectedActivityId" (click)="addActivity()">
              <i class="pi pi-plus"></i> Dodaj
            </button>
          </div>
        </div>

      </div>
    </p-dialog>
  `
})
export class ServiceOrdersComponent implements OnInit {
  orders: ServiceOrder[] = [];
  vehicles: Vehicle[] = [];
  allActivities: ServiceActivity[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;

  // Activities modal
  activitiesModalVisible = false;
  activeOrder: ServiceOrder | null = null;
  orderActivities: ServiceActivity[] = [];
  orderActivitiesLoading = false;
  selectedActivityId: number | null = null;

  form = this.fb.group({
    vehicleId: [null as number | null, Validators.required],
    description: ['', Validators.required]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
    this.api.getVehicles().subscribe(v => this.vehicles = v);
    this.api.getServiceActivities().subscribe(a => this.allActivities = a.filter(x => x.isActive));
  }

  load() {
    this.loading = true;
    this.api.getServiceOrders().subscribe({
      next: orders => { this.orders = orders; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openModal() {
    this.form.reset();
    this.submitted = false;
    this.modalVisible = true;
  }

  closeModal() { this.modalVisible = false; }

  openActivitiesModal(order: ServiceOrder) {
    this.activeOrder = order;
    this.selectedActivityId = null;
    this.orderActivities = [];
    this.activitiesModalVisible = true;
    this.loadOrderActivities();
  }

  closeActivitiesModal() {
    this.activeOrder = null;
    this.orderActivities = [];
    this.activitiesModalVisible = false;
  }

  loadOrderActivities() {
    if (!this.activeOrder) return;
    this.orderActivitiesLoading = true;
    this.api.getActivitiesByOrder(this.activeOrder.id).subscribe({
      next: data => { this.orderActivities = data; this.orderActivitiesLoading = false; },
      error: () => { this.orderActivitiesLoading = false; }
    });
  }

  get availableActivities(): ServiceActivity[] {
    const linked = new Set(this.orderActivities.map(a => a.id));
    return this.allActivities.filter(a => !linked.has(a.id));
  }

  addActivity() {
    if (!this.activeOrder || !this.selectedActivityId) return;
    this.api.addActivityToOrder(this.activeOrder.id, this.selectedActivityId).subscribe(() => {
      this.selectedActivityId = null;
      this.loadOrderActivities();
    });
  }

  removeActivity(activityId: number) {
    if (!this.activeOrder) return;
    this.api.removeActivityFromOrder(this.activeOrder.id, activityId).subscribe(() => {
      this.loadOrderActivities();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.api.createServiceOrder(this.form.getRawValue() as any).subscribe(() => {
      this.closeModal();
      this.load();
    });
  }

  close(order: ServiceOrder) {
    this.api.closeServiceOrder(order.id).subscribe(() => this.load());
  }

  getRegistration(vehicleId: number): string {
    return this.vehicles.find(v => v.id === vehicleId)?.registration ?? `#${vehicleId}`;
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = { Open: 'Otvoreno', InProgress: 'U toku', Closed: 'Zatvoreno' };
    return map[status] ?? status;
  }
}
