import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { Material, UnitOfMeasure } from '../models/material';

@Component({
  standalone: true,
  selector: 'app-materials',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  template: `
    <!-- Tab prekidač -->
    <div style="display:flex; gap:4px; margin-bottom:24px; border-bottom:1px solid #1e293b; padding-bottom:0;">
      <button (click)="activeTab='materials'"
        style="padding:10px 20px; border:none; cursor:pointer; font-size:14px; border-radius:8px 8px 0 0; border-bottom:2px solid transparent;"
        [style.background]="activeTab==='materials' ? '#1e3a5f' : 'transparent'"
        [style.color]="activeTab==='materials' ? '#7dd3fc' : '#64748b'"
        [style.borderBottomColor]="activeTab==='materials' ? '#3b82f6' : 'transparent'">
        <i class="pi pi-box"></i> Materijali
      </button>
      <button (click)="activeTab='units'"
        style="padding:10px 20px; border:none; cursor:pointer; font-size:14px; border-radius:8px 8px 0 0; border-bottom:2px solid transparent;"
        [style.background]="activeTab==='units' ? '#1e3a5f' : 'transparent'"
        [style.color]="activeTab==='units' ? '#7dd3fc' : '#64748b'"
        [style.borderBottomColor]="activeTab==='units' ? '#3b82f6' : 'transparent'">
        <i class="pi pi-tag"></i> Jedinice mere
      </button>
    </div>

    <!-- ─── TAB: MATERIJALI ─── -->
    <ng-container *ngIf="activeTab === 'materials'">
      <div class="page-header" style="display:flex; align-items:center; justify-content:flex-end; margin-bottom:16px;">
        <button class="btn btn-primary" (click)="openAddMaterial()">
          <i class="pi pi-plus"></i> Novi materijal
        </button>
      </div>

      <div class="data-card">
        <div *ngIf="matLoading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
          <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
          <span>Učitavanje...</span>
        </div>

        <table class="data-table" *ngIf="!matLoading">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Jedinica mere</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="materials.length === 0" class="empty-row">
              <td colspan="5">
                <i class="pi pi-box" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
                Nema materijala.
              </td>
            </tr>
            <tr *ngFor="let m of materials" [style.opacity]="m.isActive ? '1' : '0.45'">
              <td style="color:#475569; font-size:13px;">{{ m.id }}</td>
              <td><strong style="color:#f1f5f9;">{{ m.name }}</strong></td>
              <td style="color:#94a3b8;">{{ m.unitOfMeasureName }}</td>
              <td>
                <span class="badge" [class.badge-open]="m.isActive" [class.badge-closed]="!m.isActive">
                  {{ m.isActive ? 'Aktivan' : 'Neaktivan' }}
                </span>
              </td>
              <td style="display:flex; gap:8px;">
                <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditMaterial(m)">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="confirmDeleteMaterial(m)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>

    <!-- ─── TAB: JEDINICE MERE ─── -->
    <ng-container *ngIf="activeTab === 'units'">
      <div class="page-header" style="display:flex; align-items:center; justify-content:flex-end; margin-bottom:16px;">
        <button class="btn btn-primary" (click)="openAddUnit()">
          <i class="pi pi-plus"></i> Nova jedinica
        </button>
      </div>

      <div class="data-card">
        <div *ngIf="unitLoading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
          <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
          <span>Učitavanje...</span>
        </div>

        <table class="data-table" *ngIf="!unitLoading">
          <thead>
            <tr>
              <th>#</th>
              <th>Naziv</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngIf="units.length === 0" class="empty-row">
              <td colspan="4">
                <i class="pi pi-tag" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
                Nema jedinica mere.
              </td>
            </tr>
            <tr *ngFor="let u of units" [style.opacity]="u.isActive ? '1' : '0.45'">
              <td style="color:#475569; font-size:13px;">{{ u.id }}</td>
              <td><strong style="color:#f1f5f9;">{{ u.name }}</strong></td>
              <td>
                <span class="badge" [class.badge-open]="u.isActive" [class.badge-closed]="!u.isActive">
                  {{ u.isActive ? 'Aktivan' : 'Neaktivan' }}
                </span>
              </td>
              <td style="display:flex; gap:8px;">
                <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditUnit(u)">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="confirmDeleteUnit(u)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ng-container>

    <!-- Modal: Materijal -->
    <p-dialog
      [header]="editMaterial ? 'Izmeni materijal' : 'Novi materijal'"
      [(visible)]="matModalVisible"
      [modal]="true" [closable]="true" [draggable]="false"
      [style]="{width: '440px'}"
      styleClass="dark-dialog">

      <form [formGroup]="matForm" (ngSubmit)="onMatSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Naziv *</label>
          <input formControlName="name" placeholder="npr. Motorno ulje 10W-40"
            [class.error]="matSubmitted && matForm.get('name')?.invalid" />
          <span class="field-error" *ngIf="matSubmitted && matForm.get('name')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Jedinica mere *</label>
          <select formControlName="unitOfMeasureId"
            [class.error]="matSubmitted && matForm.get('unitOfMeasureId')?.invalid"
            style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
            <option [ngValue]="null" disabled>Izaberi jedinicu mere</option>
            <option *ngFor="let u of activeUnits" [ngValue]="u.id">{{ u.name }}</option>
          </select>
          <span class="field-error" *ngIf="matSubmitted && matForm.get('unitOfMeasureId')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field" *ngIf="editMaterial">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" formControlName="isActive" style="width:16px; height:16px; accent-color:#003580;" />
            Aktivan
          </label>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
          <button type="button" class="btn" style="background:#334155; color:#94a3b8;" (click)="matModalVisible = false">Otkaži</button>
          <button type="submit" class="btn btn-primary"><i class="pi pi-check"></i> Sačuvaj</button>
        </div>
      </form>
    </p-dialog>

    <!-- Modal: Jedinica mere -->
    <p-dialog
      [header]="editUnit ? 'Izmeni jedinicu mere' : 'Nova jedinica mere'"
      [(visible)]="unitModalVisible"
      [modal]="true" [closable]="true" [draggable]="false"
      [style]="{width: '400px'}"
      styleClass="dark-dialog">

      <form [formGroup]="unitForm" (ngSubmit)="onUnitSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Naziv *</label>
          <input formControlName="name" placeholder="npr. kom, L, kg"
            [class.error]="unitSubmitted && unitForm.get('name')?.invalid" />
          <span class="field-error" *ngIf="unitSubmitted && unitForm.get('name')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field" *ngIf="editUnit">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer;">
            <input type="checkbox" formControlName="isActive" style="width:16px; height:16px; accent-color:#003580;" />
            Aktivan
          </label>
        </div>
        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:8px;">
          <button type="button" class="btn" style="background:#334155; color:#94a3b8;" (click)="unitModalVisible = false">Otkaži</button>
          <button type="submit" class="btn btn-primary"><i class="pi pi-check"></i> Sačuvaj</button>
        </div>
      </form>
    </p-dialog>

    <!-- Confirm brisanje -->
    <p-dialog
      header="Potvrda brisanja"
      [(visible)]="confirmVisible"
      [modal]="true" [closable]="true" [draggable]="false"
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
export class MaterialsComponent implements OnInit {
  activeTab: 'materials' | 'units' = 'materials';

  // Materijali
  materials: Material[] = [];
  matLoading = false;
  matSubmitted = false;
  matModalVisible = false;
  editMaterial: Material | null = null;

  matForm = this.fb.group({
    name: ['', Validators.required],
    unitOfMeasureId: [null as number | null, Validators.required],
    isActive: [true]
  });

  // Jedinice mere
  units: UnitOfMeasure[] = [];
  unitLoading = false;
  unitSubmitted = false;
  unitModalVisible = false;
  editUnit: UnitOfMeasure | null = null;

  unitForm = this.fb.group({
    name: ['', Validators.required],
    isActive: [true]
  });

  // Confirm brisanje
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  get activeUnits(): UnitOfMeasure[] {
    return this.units.filter(u => u.isActive);
  }

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.loadMaterials();
    this.loadUnits();
  }

  // ─── Materijali ───────────────────────────────────────────

  loadMaterials() {
    this.matLoading = true;
    this.api.getMaterials().subscribe({
      next: data => { this.materials = data; this.matLoading = false; },
      error: () => { this.matLoading = false; }
    });
  }

  openAddMaterial() {
    this.editMaterial = null;
    this.matForm.reset({ name: '', unitOfMeasureId: null, isActive: true });
    this.matSubmitted = false;
    this.matModalVisible = true;
  }

  openEditMaterial(m: Material) {
    this.editMaterial = m;
    this.matForm.setValue({ name: m.name, unitOfMeasureId: m.unitOfMeasureId, isActive: m.isActive });
    this.matSubmitted = false;
    this.matModalVisible = true;
  }

  onMatSubmit() {
    this.matSubmitted = true;
    if (this.matForm.invalid) return;
    const val = this.matForm.getRawValue();

    if (this.editMaterial) {
      this.api.updateMaterial(this.editMaterial.id, {
        name: val.name!,
        unitOfMeasureId: val.unitOfMeasureId!,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.matModalVisible = false; this.loadMaterials(); });
    } else {
      this.api.createMaterial({ name: val.name!, unitOfMeasureId: val.unitOfMeasureId! })
        .subscribe(() => { this.matModalVisible = false; this.loadMaterials(); });
    }
  }

  confirmDeleteMaterial(m: Material) {
    this.confirmMessage = `Obriši materijal "${m.name}"?`;
    this.pendingDelete = () => this.api.deleteMaterial(m.id).subscribe(() => this.loadMaterials());
    this.confirmVisible = true;
  }

  // ─── Jedinice mere ────────────────────────────────────────

  loadUnits() {
    this.unitLoading = true;
    this.api.getUnitsOfMeasure().subscribe({
      next: data => { this.units = data; this.unitLoading = false; },
      error: () => { this.unitLoading = false; }
    });
  }

  openAddUnit() {
    this.editUnit = null;
    this.unitForm.reset({ name: '', isActive: true });
    this.unitSubmitted = false;
    this.unitModalVisible = true;
  }

  openEditUnit(u: UnitOfMeasure) {
    this.editUnit = u;
    this.unitForm.setValue({ name: u.name, isActive: u.isActive });
    this.unitSubmitted = false;
    this.unitModalVisible = true;
  }

  onUnitSubmit() {
    this.unitSubmitted = true;
    if (this.unitForm.invalid) return;
    const val = this.unitForm.getRawValue();

    if (this.editUnit) {
      this.api.updateUnitOfMeasure(this.editUnit.id, {
        name: val.name!,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.unitModalVisible = false; this.loadUnits(); });
    } else {
      this.api.createUnitOfMeasure({ name: val.name! })
        .subscribe(() => { this.unitModalVisible = false; this.loadUnits(); });
    }
  }

  confirmDeleteUnit(u: UnitOfMeasure) {
    this.confirmMessage = `Obriši jedinicu mere "${u.name}"?`;
    this.pendingDelete = () => this.api.deleteUnitOfMeasure(u.id).subscribe(() => this.loadUnits());
    this.confirmVisible = true;
  }

  // ─── Zajednički confirm ───────────────────────────────────

  doDelete() {
    this.confirmVisible = false;
    this.pendingDelete?.();
  }
}
