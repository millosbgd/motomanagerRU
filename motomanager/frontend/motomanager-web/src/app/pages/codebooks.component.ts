import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { CodebookEntry } from '../models/codebook-entry';

@Component({
  standalone: true,
  selector: 'app-codebooks',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  template: `
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between;">
      <button class="btn btn-primary" (click)="openAddModal()">
        <i class="pi pi-plus"></i> Novi unos
      </button>
    </div>

    <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
      <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
      <span>Učitavanje...</span>
    </div>

    <ng-container *ngIf="!loading">
      <div *ngFor="let group of groups" class="data-card" style="margin-bottom:24px;">
        <div class="data-card-header">
          <h2>{{ group.entity }}</h2>
          <span class="count-badge">{{ group.entries.length }}</span>
        </div>
        <table class="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kod</th>
              <th>Naziv</th>
              <th>Redosled</th>
              <th>Status</th>
              <th>Akcije</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of group.entries">
              <td style="color:#475569; font-size:13px;">{{ e.id }}</td>
              <td><code style="background:#0a1428; color:#7dd3fc; padding:2px 8px; border-radius:4px; font-size:13px;">{{ e.code }}</code></td>
              <td><strong style="color:#f1f5f9;">{{ e.name }}</strong></td>
              <td style="color:#64748b;">{{ e.sortOrder }}</td>
              <td>
                <span class="badge" [class.badge-open]="e.isActive" [class.badge-closed]="!e.isActive">
                  {{ e.isActive ? 'Aktivan' : 'Neaktivan' }}
                </span>
              </td>
              <td style="display:flex; gap:8px;">
                <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditModal(e)">
                  <i class="pi pi-pencil"></i>
                </button>
                <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="delete(e)">
                  <i class="pi pi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="groups.length === 0" class="data-card">
        <div style="padding:48px; text-align:center; color:#475569;">
          <i class="pi pi-book" style="font-size:32px; display:block; margin-bottom:12px;"></i>
          Nema šifarnika. Dodaj prvi unos.
        </div>
      </div>
    </ng-container>

    <!-- Modal: Dodaj / Izmeni -->
    <p-dialog
      [header]="editEntry ? 'Izmeni unos' : 'Novi unos'"
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '480px'}"
      styleClass="dark-dialog">

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Entitet *</label>
          <input formControlName="entity" placeholder="npr. ServiceOrderStatus"
            [class.error]="submitted && form.get('entity')?.invalid"
            [readonly]="!!editEntry" [style.opacity]="editEntry ? '0.5' : '1'" />
          <span class="field-error" *ngIf="submitted && form.get('entity')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Kod *</label>
          <input formControlName="code" placeholder="npr. Open"
            [class.error]="submitted && form.get('code')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('code')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Naziv *</label>
          <input formControlName="name" placeholder="npr. Otvoreno"
            [class.error]="submitted && form.get('name')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('name')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Redosled</label>
          <input formControlName="sortOrder" type="number" placeholder="0" />
        </div>
        <div class="form-field" *ngIf="editEntry">
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
        <button class="btn" style="background:#b71c1c; color:#fff;" (click)="confirmAction()"><i class="pi pi-trash"></i> Obriši</button>
      </div>
    </p-dialog>
  `
})
export class CodebooksComponent implements OnInit {
  entries: CodebookEntry[] = [];
  groups: { entity: string; entries: CodebookEntry[] }[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  editEntry: CodebookEntry | null = null;
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  form = this.fb.group({
    entity: ['', Validators.required],
    code: ['', Validators.required],
    name: ['', Validators.required],
    sortOrder: [0],
    isActive: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getCodebook().subscribe({
      next: data => {
        this.entries = data;
        this.buildGroups();
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  buildGroups() {
    const map = new Map<string, CodebookEntry[]>();
    for (const e of this.entries) {
      if (!map.has(e.entity)) map.set(e.entity, []);
      map.get(e.entity)!.push(e);
    }
    this.groups = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([entity, entries]) => ({ entity, entries }));
  }

  openAddModal() {
    this.editEntry = null;
    this.form.reset({ sortOrder: 0, isActive: true });
    this.submitted = false;
    this.modalVisible = true;
  }

  openEditModal(entry: CodebookEntry) {
    this.editEntry = entry;
    this.form.setValue({
      entity: entry.entity,
      code: entry.code,
      name: entry.name,
      sortOrder: entry.sortOrder,
      isActive: entry.isActive
    });
    this.submitted = false;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.editEntry = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const val = this.form.getRawValue();

    if (this.editEntry) {
      this.api.updateCodebookEntry(this.editEntry.id, {
        code: val.code!,
        name: val.name!,
        sortOrder: val.sortOrder ?? 0,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.createCodebookEntry({
        entity: val.entity!,
        code: val.code!,
        name: val.name!,
        sortOrder: val.sortOrder ?? 0
      }).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  delete(entry: CodebookEntry) {
    this.confirmMessage = `Obriši "${entry.name}"?`;
    this.pendingDelete = () => this.api.deleteCodebookEntry(entry.id).subscribe(() => this.load());
    this.confirmVisible = true;
  }

  confirmAction() {
    this.confirmVisible = false;
    this.pendingDelete?.();
  }
}
