import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { ServiceOrder } from '../models/service-order';
import { Vehicle } from '../models/vehicle';

@Component({
  standalone: true,
  selector: 'app-service-orders',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
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
        <h2>Lista naloga</h2>
        <span class="count-badge">{{ orders.length }} naloga</span>
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
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="orders.length === 0" class="empty-row">
            <td colspan="6">
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
  `
})
export class ServiceOrdersComponent implements OnInit {
  orders: ServiceOrder[] = [];
  vehicles: Vehicle[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;

  form = this.fb.group({
    vehicleId: [null as number | null, Validators.required],
    description: ['', Validators.required]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
    this.api.getVehicles().subscribe(v => this.vehicles = v);
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

  closeModal() {
    this.modalVisible = false;
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
