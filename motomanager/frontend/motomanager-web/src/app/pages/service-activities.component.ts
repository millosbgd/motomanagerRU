import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import {
  ServiceActivity,
  ServiceActivityDefaultMaterial,
  ServiceActivityDefaultOperation
} from '../models/service-activity';
import { Material, ServiceOperation } from '../models/material';

@Component({
  standalone: true,
  selector: 'app-service-activities',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DialogModule],
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

      <div *ngIf="editActivity" style="margin-top:24px; border-top:1px solid #1e293b; padding-top:0;">

        <div style="display:flex; gap:0; border-bottom:1px solid #1e293b; margin-bottom:16px;">
          <button
            style="padding:10px 20px; border:none; border-bottom:2px solid transparent; background:transparent; font-size:14px; cursor:pointer; transition:all 0.15s;"
            [style.borderBottomColor]="activeDefaultsTab === 'operations' ? '#3b82f6' : 'transparent'"
            [style.color]="activeDefaultsTab === 'operations' ? '#93c5fd' : '#64748b'"
            (click)="switchToDefaultOperations()">
            Default operacije
          </button>
          <button
            style="padding:10px 20px; border:none; border-bottom:2px solid transparent; background:transparent; font-size:14px; cursor:pointer; transition:all 0.15s;"
            [style.borderBottomColor]="activeDefaultsTab === 'materials' ? '#3b82f6' : 'transparent'"
            [style.color]="activeDefaultsTab === 'materials' ? '#93c5fd' : '#64748b'"
            (click)="switchToDefaultMaterials()">
            Default materijali
          </button>
        </div>

        <div *ngIf="activeDefaultsTab === 'operations'">
          <div *ngIf="defaultOperationsLoading" style="text-align:center; padding:16px; color:#64748b;">
            <i class="pi pi-spin pi-spinner"></i> Učitavanje...
          </div>

          <div *ngIf="!defaultOperationsLoading">
            <div *ngIf="defaultOperations.length === 0" style="color:#475569; font-size:14px; padding:0 0 12px;">
              Nema default operacija.
            </div>

            <div *ngIf="defaultOperations.length > 0" style="margin-bottom:16px; overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="border-bottom:1px solid #1e293b; color:#64748b; text-align:left;">
                    <th style="padding:8px 10px;">Operacija</th>
                    <th style="padding:8px 10px; text-align:right;">Sati</th>
                    <th style="padding:8px 10px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let op of defaultOperations"
                    style="border-bottom:1px solid #0f172a; background:#0f172a; border-radius:4px;">
                    <td style="padding:8px 10px; color:#e2e8f0;">{{ op.operationName }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ op.workHours }}</td>
                    <td style="padding:8px 10px; text-align:right;">
                      <button class="btn" style="padding:3px 9px; background:#3b0f0f; color:#f87171; font-size:12px;"
                        (click)="removeDefaultOperation(op.id)">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display:grid; grid-template-columns:2fr 1fr auto; gap:8px; align-items:end;">
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Operacija</label>
                <select [(ngModel)]="newDefaultOp.operationId" (ngModelChange)="onDefaultOperationSelect($event)"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%;">
                  <option [ngValue]="null" disabled>Izaberi...</option>
                  <option *ngFor="let op of availableDefaultOperations" [ngValue]="op.id">{{ op.name }}</option>
                </select>
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Sati</label>
                <input type="number" [(ngModel)]="newDefaultOp.workHours" min="0" step="0.25"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <button class="btn btn-primary" style="padding:9px 16px;"
                [disabled]="!newDefaultOp.operationId || newDefaultOp.workHours <= 0"
                (click)="addDefaultOperation()">
                <i class="pi pi-plus"></i> Dodaj
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="activeDefaultsTab === 'materials'">
          <div *ngIf="defaultMaterialsLoading" style="text-align:center; padding:16px; color:#64748b;">
            <i class="pi pi-spin pi-spinner"></i> Učitavanje...
          </div>

          <div *ngIf="!defaultMaterialsLoading">
            <div *ngIf="defaultMaterials.length === 0" style="color:#475569; font-size:14px; padding:0 0 12px;">
              Nema default materijala.
            </div>

            <div *ngIf="defaultMaterials.length > 0" style="margin-bottom:16px; overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="border-bottom:1px solid #1e293b; color:#64748b; text-align:left;">
                    <th style="padding:8px 10px;">Materijal</th>
                    <th style="padding:8px 10px;">JM</th>
                    <th style="padding:8px 10px; text-align:right;">Količina</th>
                    <th style="padding:8px 10px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of defaultMaterials"
                    style="border-bottom:1px solid #0f172a; background:#0f172a; border-radius:4px;">
                    <td style="padding:8px 10px; color:#e2e8f0;">{{ m.materialName }}</td>
                    <td style="padding:8px 10px; color:#94a3b8;">{{ m.unitOfMeasureName ?? '-' }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ m.quantity }}</td>
                    <td style="padding:8px 10px; text-align:right;">
                      <button class="btn" style="padding:3px 9px; background:#3b0f0f; color:#f87171; font-size:12px;"
                        (click)="removeDefaultMaterial(m.id)">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style="display:grid; grid-template-columns:2fr 1fr auto; gap:8px; align-items:end;">
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Materijal</label>
                <select [(ngModel)]="newDefaultMat.materialId"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%;">
                  <option [ngValue]="null" disabled>Izaberi...</option>
                  <option *ngFor="let m of availableDefaultMaterials" [ngValue]="m.id">{{ m.name }}</option>
                </select>
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Količina</label>
                <input type="number" [(ngModel)]="newDefaultMat.quantity" min="0" step="0.01"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <button class="btn btn-primary" style="padding:9px 16px;"
                [disabled]="!newDefaultMat.materialId || newDefaultMat.quantity <= 0"
                (click)="addDefaultMaterial()">
                <i class="pi pi-plus"></i> Dodaj
              </button>
            </div>
          </div>
        </div>

      </div>
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
  allOperations: ServiceOperation[] = [];
  allMaterials: Material[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  editActivity: ServiceActivity | null = null;
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  activeDefaultsTab = 'operations';
  defaultOperations: ServiceActivityDefaultOperation[] = [];
  defaultMaterials: ServiceActivityDefaultMaterial[] = [];
  defaultOperationsLoading = false;
  defaultMaterialsLoading = false;
  newDefaultOp: { operationId: number | null; workHours: number } = { operationId: null, workHours: 0 };
  newDefaultMat: { materialId: number | null; quantity: number } = { materialId: null, quantity: 0 };

  form = this.fb.group({
    name: ['', Validators.required],
    isActive: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
    this.api.getServiceOperations().subscribe(o => this.allOperations = o.filter(x => x.isActive));
    this.api.getMaterials().subscribe(m => this.allMaterials = m.filter(x => x.isActive));
  }

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
    this.activeDefaultsTab = 'operations';
    this.defaultOperations = [];
    this.defaultMaterials = [];
    this.newDefaultOp = { operationId: null, workHours: 0 };
    this.newDefaultMat = { materialId: null, quantity: 0 };
    this.loadDefaultOperations();
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.editActivity = null;
    this.defaultOperations = [];
    this.defaultMaterials = [];
  }

  switchToDefaultOperations() {
    this.activeDefaultsTab = 'operations';
    if (this.editActivity && this.defaultOperations.length === 0 && !this.defaultOperationsLoading) {
      this.loadDefaultOperations();
    }
  }

  switchToDefaultMaterials() {
    this.activeDefaultsTab = 'materials';
    if (this.editActivity && this.defaultMaterials.length === 0 && !this.defaultMaterialsLoading) {
      this.loadDefaultMaterials();
    }
  }

  loadDefaultOperations() {
    if (!this.editActivity) return;
    this.defaultOperationsLoading = true;
    this.api.getActivityDefaultOperations(this.editActivity.id).subscribe({
      next: data => { this.defaultOperations = data; this.defaultOperationsLoading = false; },
      error: () => { this.defaultOperationsLoading = false; }
    });
  }

  loadDefaultMaterials() {
    if (!this.editActivity) return;
    this.defaultMaterialsLoading = true;
    this.api.getActivityDefaultMaterials(this.editActivity.id).subscribe({
      next: data => { this.defaultMaterials = data; this.defaultMaterialsLoading = false; },
      error: () => { this.defaultMaterialsLoading = false; }
    });
  }

  get availableDefaultOperations(): ServiceOperation[] {
    const linked = new Set(this.defaultOperations.map(o => o.serviceOperationId));
    return this.allOperations.filter(o => !linked.has(o.id));
  }

  get availableDefaultMaterials(): Material[] {
    const linked = new Set(this.defaultMaterials.map(m => m.materialId));
    return this.allMaterials.filter(m => !linked.has(m.id));
  }

  onDefaultOperationSelect(id: number | null) {
    const op = this.allOperations.find(o => o.id === id);
    if (op) { this.newDefaultOp.workHours = Number(op.workHours); }
  }

  addDefaultOperation() {
    if (!this.editActivity || !this.newDefaultOp.operationId) return;
    this.api.addActivityDefaultOperation(this.editActivity.id, {
      serviceOperationId: this.newDefaultOp.operationId,
      workHours: this.newDefaultOp.workHours
    }).subscribe(() => {
      this.newDefaultOp = { operationId: null, workHours: 0 };
      this.loadDefaultOperations();
    });
  }

  removeDefaultOperation(rowId: number) {
    if (!this.editActivity) return;
    this.api.removeActivityDefaultOperation(rowId).subscribe(() => {
      this.loadDefaultOperations();
    });
  }

  addDefaultMaterial() {
    if (!this.editActivity || !this.newDefaultMat.materialId) return;
    this.api.addActivityDefaultMaterial(this.editActivity.id, {
      materialId: this.newDefaultMat.materialId,
      quantity: this.newDefaultMat.quantity
    }).subscribe(() => {
      this.newDefaultMat = { materialId: null, quantity: 0 };
      this.loadDefaultMaterials();
    });
  }

  removeDefaultMaterial(rowId: number) {
    if (!this.editActivity) return;
    this.api.removeActivityDefaultMaterial(rowId).subscribe(() => {
      this.loadDefaultMaterials();
    });
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
