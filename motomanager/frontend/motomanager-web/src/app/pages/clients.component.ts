import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { Client } from '../models/client';
import { CodebookEntry } from '../models/codebook-entry';

@Component({
  standalone: true,
  selector: 'app-clients',
  imports: [CommonModule, ReactiveFormsModule, DialogModule],
  template: `
    <div class="page-header" style="display:flex; align-items:center; justify-content:space-between;">
      <div>
        <h1>Klijenti</h1>
        <p>Evidencija klijenata</p>
      </div>
      <button class="btn btn-primary" (click)="openAddModal()">
        <i class="pi pi-plus"></i> Novi klijent
      </button>
    </div>

    <div class="data-card">
      <div class="data-card-header">
        <span class="count-badge">{{ clients.length }} klijenata</span>
      </div>

      <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
        <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
        <span>Učitavanje...</span>
      </div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Naziv</th>
            <th>Adresa</th>
            <th>Grad</th>
            <th>Zemlja</th>
            <th>Status</th>
            <th>Akcije</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="clients.length === 0" class="empty-row">
            <td colspan="7">
              <i class="pi pi-users" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema klijenata. Dodaj prvog klijenta.
            </td>
          </tr>
          <tr *ngFor="let c of clients">
            <td style="color:#475569; font-size:13px;">{{ c.id }}</td>
            <td><strong style="color:#f1f5f9;">{{ c.name }}</strong></td>
            <td style="color:#94a3b8;">{{ c.address || '—' }}</td>
            <td style="color:#94a3b8;">{{ c.city || '—' }}</td>
            <td style="color:#94a3b8;">{{ c.country || '—' }}</td>
            <td>
              <span class="badge" [class.badge-open]="c.isActive" [class.badge-closed]="!c.isActive">
                {{ c.isActive ? 'Aktivan' : 'Neaktivan' }}
              </span>
            </td>
            <td style="display:flex; gap:8px;">
              <button class="btn" style="padding:6px 12px; background:#1e3a5f; color:#94a3b8; font-size:13px;" (click)="openEditModal(c)">
                <i class="pi pi-pencil"></i>
              </button>
              <button class="btn" style="padding:6px 12px; background:#3b0f0f; color:#f87171; font-size:13px;" (click)="delete(c)">
                <i class="pi pi-trash"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <p-dialog
      [header]="editClient ? 'Izmeni klijenta' : 'Novi klijent'"
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '480px'}"
      styleClass="dark-dialog">

      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px; padding:8px 0;">
        <div class="form-field">
          <label>Naziv *</label>
          <input formControlName="name" placeholder="npr. Petar Petrović"
            [class.error]="submitted && form.get('name')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('name')?.invalid">Obavezno polje</span>
        </div>
        <div class="form-field">
          <label>Adresa</label>
          <input formControlName="address" placeholder="npr. Knez Mihailova 1" />
        </div>
        <div class="form-field">
          <label>Grad</label>
          <input formControlName="city" placeholder="npr. Beograd" />
        </div>
        <div class="form-field">
          <label>Zemlja</label>
          <select *ngIf="countries.length > 0" formControlName="country"
            style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
            <option [ngValue]="null">— Izaberi zemlju —</option>
            <option *ngFor="let co of countries" [value]="co.code">{{ co.name }}</option>
          </select>
          <input *ngIf="countries.length === 0" formControlName="country" placeholder="npr. Srbija" />
          <span *ngIf="countries.length === 0" style="font-size:11px; color:#475569; margin-top:4px; display:block;">
            Dodaj šifarnik "Country" za dropdown
          </span>
        </div>
        <div class="form-field" *ngIf="editClient">
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
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  countries: CodebookEntry[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  editClient: Client | null = null;
  confirmVisible = false;
  confirmMessage = '';
  private pendingDelete?: () => void;

  form = this.fb.group({
    name: ['', Validators.required],
    address: [null as string | null],
    city: [null as string | null],
    country: [null as string | null],
    isActive: [true]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
    this.api.getCodebookByEntity('Country').subscribe(data => this.countries = data);
  }

  load() {
    this.loading = true;
    this.api.getClients().subscribe({
      next: data => { this.clients = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openAddModal() {
    this.editClient = null;
    this.form.reset({ isActive: true });
    this.submitted = false;
    this.modalVisible = true;
  }

  openEditModal(client: Client) {
    this.editClient = client;
    this.form.setValue({
      name: client.name,
      address: client.address ?? null,
      city: client.city ?? null,
      country: client.country ?? null,
      isActive: client.isActive
    });
    this.submitted = false;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
    this.editClient = null;
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;

    const val = this.form.getRawValue();

    if (this.editClient) {
      this.api.updateClient(this.editClient.id, {
        name: val.name!,
        address: val.address ?? undefined,
        city: val.city ?? undefined,
        country: val.country ?? undefined,
        isActive: val.isActive ?? true
      }).subscribe(() => { this.closeModal(); this.load(); });
    } else {
      this.api.createClient({
        name: val.name!,
        address: val.address ?? undefined,
        city: val.city ?? undefined,
        country: val.country ?? undefined
      }).subscribe(() => { this.closeModal(); this.load(); });
    }
  }

  delete(client: Client) {
    this.confirmMessage = `Obriši klijenta "${client.name}"?`;
    this.pendingDelete = () => this.api.deleteClient(client.id).subscribe(() => this.load());
    this.confirmVisible = true;
  }

  confirmAction() {
    this.confirmVisible = false;
    this.pendingDelete?.();
  }
}
