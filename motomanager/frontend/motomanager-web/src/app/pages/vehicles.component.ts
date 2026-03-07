import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { Vehicle } from '../models/vehicle';

@Component({
  standalone: true,
  selector: 'app-vehicles',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  template: `
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between;">
      <div>
        <h1>Vozila</h1>
        <p>Evidencija svih registrovanih vozila</p>
      </div>
      <button class="btn btn-primary" (click)="openAddModal()">
        <i class="pi pi-plus"></i> Dodaj vozilo
      </button>
    </div>

    <div class="data-card">
      <div class="data-card-header">
        <h2>Lista vozila</h2>
        <span class="count-badge">{{ vehicles.length }} vozila</span>
      </div>

      <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
        <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
        <span>Učitavanje... (server se budi, može trajati do 60s)</span>
      </div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Registracija</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Godina</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="vehicles.length === 0" class="empty-row">
            <td colspan="7">
              <i class="pi pi-car" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema vozila. Dodaj prvo vozilo.
            </td>
          </tr>
          <tr *ngFor="let v of vehicles">
            <td style="color:#475569; font-size:13px;">{{ v.id }}</td>
            <td><strong style="color:#f1f5f9;">{{ v.registration }}</strong></td>
            <td>{{ v.make }}</td>
            <td>{{ v.model }}</td>
            <td>{{ v.year ?? '—' }}</td>
            <td>
              <span class="badge" [class.badge-open]="v.isActive" [class.badge-closed]="!v.isActive">
                {{ v.isActive ? 'Aktivno' : 'Neaktivno' }}
              </span>
            </td>
            <td style="display:flex; gap:8px;">
              <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditModal(v)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="delete(v)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <p-dialog
      [header]="editVehicle ? 'Izmeni vozilo' : 'Novo vozilo'"
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '480px'}"
      styleClass="dark-dialog">

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Registracija *</label>
          <input formControlName="registration" placeholder="npr. BG-123-AB"
            [class.error]="submitted && form.get('registration')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('registration')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Marka *</label>
          <input formControlName="make" placeholder="npr. BMW"
            [class.error]="submitted && form.get('make')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('make')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Model *</label>
          <input formControlName="model" placeholder="npr. R 1250 GS"
            [class.error]="submitted && form.get('model')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('model')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Godina</label>
          <input formControlName="year" type="number" placeholder="npr. 2022"
            [class.error]="submitted && form.get('year')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('year')?.invalid">1950 — {{ currentYear }}</span>
        </div>
        <div class="form-field" *ngIf="editVehicle">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" formControlName="isActive" style="width:16px; height:16px; accent-color:#003580;" />
            Aktivno
          </label>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
          <button type="button" class="btn" style="background:#334155; color:#94a3b8;" (click)="closeModal()">Otkaži</button>
          <button type="submit" class="btn btn-primary"><i class="pi pi-check"></i> Sačuvaj</button>
        </div>
      </form>
    </p-dialog>

    <!-- Confirm brisanje -->
    <p-dialog
      header="Potvrda brisanja"
      [(visible)]="confirmVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '400px'}"
      styleClass="dark-dialog">
      <p style="color:#cbd5e1; margin:8px 0 24px;">{{ confirmMessage }}</p>
      <div style="display:flex; gap:12px; justify-content:flex-end;">
        <button class="btn" style="background:#334155; color:#94a3b8;" (click)="confirmVisible = false">Otkaži</button>
        <button class="btn" style="background:#b71c1c; color:#fff;" (click)="confirmAction()"><i class="pi pi-trash"></i> Obriši</button>
      </div>
    </p-dialog>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  editVehicle: Vehicle | null = null;
  currentYear = new Date().getFullYear();
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  form = this.fb.group({
    registration: ['', Validators.required],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null, [Validators.min(1950), Validators.max(new Date().getFullYear() + 1)]],
    isActive: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getVehicles().subscribe({
      next: v => { this.vehicles = v; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openAddModal() {
    this.editVehicle = null;
    this.form.reset({ isActive: true });
    this.submitted = false;
    this.modalVisible = true;
  }

  openEditModal(vehicle: Vehicle) {
    this.editVehicle = vehicle;
    this.form.setValue({
      registration: vehicle.registration,
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year ?? null,
      isActive: vehicle.isActive
    });
    this.submitted = false;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.editVehicle = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const val = this.form.getRawValue();

    if (this.editVehicle) {
      this.api.updateVehicle(this.editVehicle.id, {
        registration: val.registration!,
        make: val.make!,
        model: val.model!,
        year: val.year ?? undefined,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.createVehicle({
        registration: val.registration!,
        make: val.make!,
        model: val.model!,
        year: val.year ?? undefined
      }).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  delete(vehicle: Vehicle) {
    this.confirmMessage = `Obriši vozilo "${vehicle.registration} — ${vehicle.make} ${vehicle.model}"?`;
    this.pendingDelete = () => this.api.deleteVehicle(vehicle.id).subscribe(() => this.load());
    this.confirmVisible = true;
  }

  confirmAction() {
    this.confirmVisible = false;
    this.pendingDelete?.();
  }
}
