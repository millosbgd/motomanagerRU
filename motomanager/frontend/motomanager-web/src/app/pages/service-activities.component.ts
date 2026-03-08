import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { ServiceActivity } from '../models/service-activity';

@Component({
  standalone: true,
  selector: 'app-service-activities',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  template: `
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between;">
      <button class="btn btn-primary" (click)="openAddModal()">
        <i class="pi pi-plus"></i> Nova aktivnost
      </button>
    </div>

    <div class="data-card">
      <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
        <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
        <span>Učitavanje...</span>
      </div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="activities.length === 0" class="empty-row">
            <td colspan="4">
              <i class="pi pi-list" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema aktivnosti.
            </td>
          </tr>
          <tr *ngFor="let a of activities" [style.opacity]="a.isActive ? '1' : '0.45'">
            <td style="color:#475569; font-size:13px;">{{ a.id }}</td>
            <td><strong style="color:#f1f5f9;">{{ a.name }}</strong></td>
            <td>
              <span class="badge" [class.badge-open]="a.isActive" [class.badge-closed]="!a.isActive">
                {{ a.isActive ? 'Aktivan' : 'Neaktivan' }}
              </span>
            </td>
            <td style="display:flex; gap:8px;">
              <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditModal(a)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="confirmDelete(a)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Dodaj / Izmeni -->
    <p-dialog
      [header]="editActivity ? 'Izmeni aktivnost' : 'Nova aktivnost'"
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '440px'}"
      styleClass="dark-dialog">

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Naziv aktivnosti *</label>
          <input formControlName="name" placeholder="npr. Zamena ulja"
            [class.error]="submitted && form.get('name')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('name')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field" *ngIf="editActivity">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" formControlName="isActive" style="width:16px; height:16px; accent-color:#003580;" />
            Aktivan
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
        <button class="btn" style="background:#b71c1c; color:#fff;" (click)="doDelete()">
          <i class="pi pi-trash"></i> Obriši
        </button>
      </div>
    </p-dialog>
  `
})
export class ServiceActivitiesComponent implements OnInit {
  activities: ServiceActivity[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  editActivity: ServiceActivity | null = null;
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  form = this.fb.group({
    name: ['', Validators.required],
    isActive: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getServiceActivities().subscribe({
      next: data => { this.activities = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openAddModal() {
    this.editActivity = null;
    this.form.reset({ name: '', isActive: true });
    this.submitted = false;
    this.modalVisible = true;
  }

  openEditModal(a: ServiceActivity) {
    this.editActivity = a;
    this.form.setValue({ name: a.name, isActive: a.isActive });
    this.submitted = false;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.editActivity = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const val = this.form.getRawValue();

    if (this.editActivity) {
      this.api.updateServiceActivity(this.editActivity.id, {
        name: val.name!,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.createServiceActivity({ name: val.name! })
        .subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  confirmDelete(a: ServiceActivity) {
    this.confirmMessage = `Obriši aktivnost "${a.name}"?`;
    this.pendingDelete = () => this.api.deleteServiceActivity(a.id).subscribe(() => this.load());
    this.confirmVisible = true;
  }

  doDelete() {
    this.confirmVisible = false;
    this.pendingDelete?.();
  }
}
