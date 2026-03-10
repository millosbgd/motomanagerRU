import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ApiService } from '../services/api.service';
import { ServiceOrder } from '../models/service-order';
import { Vehicle } from '../models/vehicle';
import { ServiceActivity } from '../models/service-activity';
import { Client } from '../models/client';
import { ServiceOperation } from '../models/material';
import { ServiceOrderOperation } from '../models/service-order-operation';
import { ServiceOrderMaterial } from '../models/service-order-material';

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
      <div *ngIf="loading" style="display:flex; align-items:center; gap:12px; padding:32px; color:#64748b; justify-content:center;">
        <i class="pi pi-spin pi-spinner" style="font-size:20px;"></i>
        <span>Učitavanje... (server se budi, može trajati do 60s)</span>
      </div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>#</th>
            <th>Klijent</th>
            <th>Vozilo</th>
            <th>Opis</th>
            <th>Status</th>
            <th>Datum</th>
            <th>Km</th>
            <th>Akcija</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="orders.length === 0" class="empty-row">
            <td colspan="8">
              <i class="pi pi-wrench" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema naloga.
            </td>
          </tr>
          <tr *ngFor="let o of orders">
            <td style="color:#475569; font-size:13px;">{{ o.id }}</td>
            <td style="color:#94a3b8; font-size:13px;">{{ getClientForVehicle(o.vehicleId) }}</td>
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
            <td style="color:#64748b; font-size:13px;">{{ o.date | date:'dd.MM.yyyy' }}</td>
            <td style="color:#64748b; font-size:13px;">{{ o.mileage | number }}</td>
            <td style="display:flex; gap:6px; align-items:center;">
              <button class="btn" style="padding:5px 12px; background:#1e3a5f; color:#7dd3fc; font-size:13px;" (click)="openEdit(o)">
                <i class="pi pi-pencil"></i> Uredi
              </button>
              <button *ngIf="o.status !== 'Closed'" class="btn btn-success" (click)="close(o)">
                <i class="pi pi-check"></i> Zatvori
              </button>
              <span *ngIf="o.status === 'Closed'" style="color:#334155; font-size:12px;">Zatvoreno</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal: Novi / Uredi nalog -->
    <p-dialog
      [(visible)]="modalVisible"
      [modal]="true"
      [closable]="true"
      [draggable]="false"
      [style]="{width: '1100px', maxWidth: '96vw'}"
      styleClass="dark-dialog"
      (onHide)="closeModal()">

      <!-- Custom header -->
      <ng-template pTemplate="header">

        <!-- Novi nalog: jednostavan naslov -->
        <span *ngIf="!editingOrder" style="font-size:18px; font-weight:600; color:#f1f5f9;">
          Novi servisni nalog
        </span>

        <!-- Edit: dva reda sa podacima o nalogu -->
        <div *ngIf="editingOrder" style="display:flex; flex-direction:column; gap:6px; flex:1;">
          <!-- Red 1: ID, vozilo, klijent, status -->
          <div style="display:flex; align-items:center; gap:20px; flex-wrap:wrap;">
            <span style="font-size:20px; font-weight:700; color:#f1f5f9;">Nalog #{{ editingOrder.id }}</span>
            <span style="font-size:16px; font-weight:600; color:#7dd3fc;">{{ getRegistration(editingOrder.vehicleId) }}</span>
            <span *ngIf="getClientForVehicle(editingOrder.vehicleId)" style="font-size:14px; color:#94a3b8;">{{ getClientForVehicle(editingOrder.vehicleId) }}</span>
            <span class="badge"
              [class.badge-open]="editingOrder.status === 'Open'"
              [class.badge-inprogress]="editingOrder.status === 'InProgress'"
              [class.badge-closed]="editingOrder.status === 'Closed'">
              {{ statusLabel(editingOrder.status) }}
            </span>
          </div>
          <!-- Red 2: datum, km, otvoreno -->
          <div style="display:flex; align-items:center; gap:24px; flex-wrap:wrap;">
            <span style="font-size:13px; color:#475569;">
              <span style="color:#64748b; margin-right:4px;">Datum:</span>
              <span style="color:#94a3b8;">{{ editingOrder.date | date:'dd.MM.yyyy' }}</span>
            </span>
            <span style="font-size:13px; color:#475569;">
              <span style="color:#64748b; margin-right:4px;">Kilometraža:</span>
              <span style="color:#94a3b8;">{{ editingOrder.mileage | number }} km</span>
            </span>
            <span style="font-size:13px; color:#475569;">
              <span style="color:#64748b; margin-right:4px;">Otvoreno:</span>
              <span style="color:#94a3b8;">{{ editingOrder.openedAt | date:'dd.MM.yyyy' }}</span>
            </span>
            <span *ngIf="editingOrder.closedAt" style="font-size:13px;">
              <span style="color:#64748b; margin-right:4px;">Zatvoreno:</span>
              <span style="color:#94a3b8;">{{ editingOrder.closedAt | date:'dd.MM.yyyy' }}</span>
            </span>
          </div>
        </div>

      </ng-template>

      <!-- Forma -->
      <form [formGroup]="form" (ngSubmit)="onSubmit()" style="display:flex; flex-direction:column; gap:16px;">

        <!-- Klijent + Vozilo (samo za novi nalog) -->
        <div *ngIf="!editingOrder" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-field">
            <label>Klijent</label>
            <select [ngModel]="selectedClientId" (ngModelChange)="onClientChange($event)" [ngModelOptions]="{standalone: true}"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
              <option [ngValue]="null">Svi klijenti</option>
              <option *ngFor="let c of clients" [ngValue]="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-field">
            <label>Vozilo *</label>
            <select formControlName="vehicleId"
              [class.error]="submitted && form.get('vehicleId')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
              <option [ngValue]="null" disabled>Izaberi vozilo</option>
              <option *ngFor="let v of filteredVehicles" [ngValue]="v.id">
                {{ v.registration }} &mdash; {{ v.make }} {{ v.model }}
              </option>
            </select>
            <span class="field-error" *ngIf="submitted && form.get('vehicleId')?.invalid">Izaberi vozilo</span>
          </div>
        </div>

        <!-- Edit: Klijent + Vozilo -->
        <div *ngIf="editingOrder" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-field">
            <label>Klijent</label>
            <select [ngModel]="selectedClientId" (ngModelChange)="onClientChange($event)" [ngModelOptions]="{standalone: true}"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
              <option [ngValue]="null">Svi klijenti</option>
              <option *ngFor="let c of clients" [ngValue]="c.id">{{ c.name }}</option>
            </select>
          </div>
          <div class="form-field">
            <label>Vozilo *</label>
            <select formControlName="vehicleId"
              [class.error]="submitted && form.get('vehicleId')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
              <option [ngValue]="null" disabled>Izaberi vozilo</option>
              <option *ngFor="let v of filteredVehicles" [ngValue]="v.id">{{ v.registration }} &mdash; {{ v.make }} {{ v.model }}</option>
            </select>
            <span class="field-error" *ngIf="submitted && form.get('vehicleId')?.invalid">Izaberi vozilo</span>
          </div>
        </div>

        <!-- Edit: Datum | Km | Status u tri kolone -->
        <div *ngIf="editingOrder" style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:16px;">
          <div class="form-field">
            <label>Datum servisa *</label>
            <input type="date" formControlName="date"
              [class.error]="submitted && form.get('date')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
            <span class="field-error" *ngIf="submitted && form.get('date')?.invalid">Obavezno polje</span>
          </div>
          <div class="form-field">
            <label>Kilometraža *</label>
            <input type="number" formControlName="mileage" placeholder="npr. 45000" min="0"
              [class.error]="submitted && form.get('mileage')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
            <span class="field-error" *ngIf="submitted && form.get('mileage')?.invalid">Unesite kilometražu</span>
          </div>
          <div class="form-field">
            <label>Status</label>
            <select formControlName="status"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%;">
              <option value="Open">Otvoreno</option>
              <option value="InProgress">U toku</option>
              <option value="Closed">Zatvoreno</option>
            </select>
          </div>
        </div>

        <!-- Novi nalog: Datum | Km u dve kolone -->
        <div *ngIf="!editingOrder" style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
          <div class="form-field">
            <label>Datum servisa *</label>
            <input type="date" formControlName="date"
              [class.error]="submitted && form.get('date')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
            <span class="field-error" *ngIf="submitted && form.get('date')?.invalid">Obavezno polje</span>
          </div>
          <div class="form-field">
            <label>Kilometraža *</label>
            <input type="number" formControlName="mileage" placeholder="npr. 45000" min="0"
              [class.error]="submitted && form.get('mileage')?.invalid"
              style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:10px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
            <span class="field-error" *ngIf="submitted && form.get('mileage')?.invalid">Unesite kilometražu</span>
          </div>
        </div>

        <div class="form-field">
          <label>Opis radova *</label>
          <input formControlName="description" placeholder="npr. Zamena ulja i filtera"
            [class.error]="submitted && form.get('description')?.invalid" />
          <span class="field-error" *ngIf="submitted && form.get('description')?.invalid">Obavezno polje</span>
        </div>

        <div style="display:flex; gap:12px; justify-content:flex-end; margin-top:4px;">
          <button type="button" class="btn" style="background:#334155; color:#94a3b8;" (click)="closeModal()">Otkaži</button>
          <button type="submit" class="btn btn-primary"><i class="pi pi-check"></i> Sačuvaj</button>
        </div>
      </form>

      <!-- Tabovi (samo za edit) -->
      <div *ngIf="editingOrder" style="margin-top:24px; border-top:1px solid #1e293b; padding-top:0;">

        <!-- Tab bar -->
        <div style="display:flex; gap:0; border-bottom:1px solid #1e293b; margin-bottom:16px;">
          <button
            style="padding:10px 20px; border:none; border-bottom:2px solid transparent; background:transparent; font-size:14px; cursor:pointer; transition:all 0.15s;"
            [style.borderBottomColor]="activeFormTab === 'activities' ? '#3b82f6' : 'transparent'"
            [style.color]="activeFormTab === 'activities' ? '#93c5fd' : '#64748b'"
            (click)="activeFormTab = 'activities'">
            Aktivnosti
          </button>
          <button
            style="padding:10px 20px; border:none; border-bottom:2px solid transparent; background:transparent; font-size:14px; cursor:pointer; transition:all 0.15s;"
            [style.borderBottomColor]="activeFormTab === 'operations' ? '#3b82f6' : 'transparent'"
            [style.color]="activeFormTab === 'operations' ? '#93c5fd' : '#64748b'"
            (click)="switchToOperations()">
            Servisne operacije
          </button>
          <button
            style="padding:10px 20px; border:none; border-bottom:2px solid transparent; background:transparent; font-size:14px; cursor:pointer; transition:all 0.15s;"
            [style.borderBottomColor]="activeFormTab === 'materials' ? '#3b82f6' : 'transparent'"
            [style.color]="activeFormTab === 'materials' ? '#93c5fd' : '#64748b'"
            (click)="switchToMaterials()">
            Materijali
          </button>
        </div>

        <!-- Tab: Aktivnosti -->
        <div *ngIf="activeFormTab === 'activities'">
          <div *ngIf="orderActivitiesLoading" style="text-align:center; padding:16px; color:#64748b;">
            <i class="pi pi-spin pi-spinner"></i> Učitavanje...
          </div>

          <div *ngIf="!orderActivitiesLoading">
            <div *ngIf="applyDefaultsMessage" style="margin:0 0 12px; color:#7dd3fc; font-size:13px;">
              {{ applyDefaultsMessage }}
            </div>
            <div *ngIf="orderActivities.length === 0" style="color:#475569; font-size:14px; padding:0 0 12px;">
              Nema aktivnosti na ovom nalogu.
            </div>

            <div *ngFor="let a of orderActivities"
              style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:#0f172a; border-radius:8px; margin-bottom:6px;">
              <span style="color:#e2e8f0; font-size:14px;">{{ a.name }}</span>
              <div style="display:flex; gap:6px;">
                <button class="btn" style="padding:4px 10px; background:#1e3a5f; color:#7dd3fc; font-size:12px;"
                  [disabled]="applyingDefaultsId === a.id" (click)="applyDefaults(a.id)">
                  <i class="pi pi-magic"></i> Default
                </button>
                <button class="btn" style="padding:4px 10px; background:#3b0f0f; color:#f87171; font-size:12px;" (click)="removeActivity(a.id)">
                  <i class="pi pi-times"></i>
                </button>
              </div>
            </div>

            <div style="display:flex; gap:8px; margin-top:12px;">
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

        <!-- Tab: Servisne operacije -->
        <div *ngIf="activeFormTab === 'operations'">
          <div *ngIf="orderOperationsLoading" style="text-align:center; padding:16px; color:#64748b;">
            <i class="pi pi-spin pi-spinner"></i> Učitavanje...
          </div>

          <div *ngIf="!orderOperationsLoading">

            <!-- Tabela postojećih operacija -->
            <div *ngIf="orderOperations.length > 0" style="margin-bottom:16px; overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="border-bottom:1px solid #1e293b; color:#64748b; text-align:left;">
                    <th style="padding:8px 10px;">Operacija</th>
                    <th style="padding:8px 10px; text-align:right;">Sati</th>
                    <th style="padding:8px 10px; text-align:right;">Cena/h</th>
                    <th style="padding:8px 10px; text-align:right;">Ukupno</th>
                    <th style="padding:8px 10px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let op of orderOperations"
                    style="border-bottom:1px solid #0f172a; background:#0f172a; border-radius:4px;">
                    <td style="padding:8px 10px; color:#e2e8f0;">{{ op.operationName }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ op.workHours }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ op.pricePerHour | number:'1.2-2' }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#7dd3fc; font-weight:600;">{{ op.totalPrice | number:'1.2-2' }}</td>
                    <td style="padding:8px 10px; text-align:right;">
                      <button class="btn" style="padding:3px 9px; background:#3b0f0f; color:#f87171; font-size:12px;" (click)="removeOperation(op.id)">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                  <tr style="border-top:2px solid #1e293b;">
                    <td colspan="3" style="padding:8px 10px; color:#64748b; font-size:12px; text-align:right;">UKUPNO:</td>
                    <td style="padding:8px 10px; text-align:right; color:#f1f5f9; font-weight:700; font-size:14px;">{{ operationsTotal | number:'1.2-2' }}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="orderOperations.length === 0" style="color:#475569; font-size:14px; padding:0 0 12px;">
              Nema operacija na ovom nalogu.
            </div>

            <!-- Forma za dodavanje -->
            <div style="display:grid; grid-template-columns:2fr 1fr 1fr auto; gap:8px; align-items:end; margin-top:8px;">
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Operacija</label>
                <select [(ngModel)]="newOp.operationId" (ngModelChange)="onOperationSelect($event)"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%;">
                  <option [ngValue]="null" disabled>Izaberi...</option>
                  <option *ngFor="let op of allOperations" [ngValue]="op.id">{{ op.name }}</option>
                </select>
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Sati</label>
                <input type="number" [(ngModel)]="newOp.workHours" min="0" step="0.25"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Cena/h</label>
                <input type="number" [(ngModel)]="newOp.pricePerHour" min="0" step="100"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <button class="btn btn-primary" style="padding:9px 16px;"
                [disabled]="!newOp.operationId || newOp.workHours <= 0"
                (click)="addOperation()">
                <i class="pi pi-plus"></i> Dodaj
              </button>
            </div>
            <div *ngIf="newOp.operationId && newOp.workHours > 0 && newOp.pricePerHour > 0"
              style="text-align:right; font-size:13px; color:#7dd3fc; margin-top:6px;">
              = {{ (newOp.workHours * newOp.pricePerHour) | number:'1.2-2' }}
            </div>

          </div>
        </div>

        <!-- Tab: Materijali -->
        <div *ngIf="activeFormTab === 'materials'">
          <div *ngIf="orderMaterialsLoading" style="text-align:center; padding:16px; color:#64748b;">
            <i class="pi pi-spin pi-spinner"></i> Učitavanje...
          </div>

          <div *ngIf="!orderMaterialsLoading">

            <!-- Tabela postojećih materijala -->
            <div *ngIf="orderMaterials.length > 0" style="margin-bottom:16px; overflow-x:auto;">
              <table style="width:100%; border-collapse:collapse; font-size:13px;">
                <thead>
                  <tr style="border-bottom:1px solid #1e293b; color:#64748b; text-align:left;">
                    <th style="padding:8px 10px;">Materijal</th>
                    <th style="padding:8px 10px;">JM</th>
                    <th style="padding:8px 10px; text-align:right;">Količina</th>
                    <th style="padding:8px 10px; text-align:right;">Cena/jm</th>
                    <th style="padding:8px 10px; text-align:right;">Ukupno</th>
                    <th style="padding:8px 10px;"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let m of orderMaterials"
                    style="border-bottom:1px solid #0f172a; background:#0f172a; border-radius:4px;">
                    <td style="padding:8px 10px; color:#e2e8f0;">{{ m.materialName }}</td>
                    <td style="padding:8px 10px; color:#94a3b8;">{{ m.unitOfMeasureName ?? '-' }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ m.quantity }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#94a3b8;">{{ m.pricePerUnit | number:'1.2-2' }}</td>
                    <td style="padding:8px 10px; text-align:right; color:#7dd3fc; font-weight:600;">{{ m.totalPrice | number:'1.2-2' }}</td>
                    <td style="padding:8px 10px; text-align:right;">
                      <button class="btn" style="padding:3px 9px; background:#3b0f0f; color:#f87171; font-size:12px;" (click)="removeMaterial(m.id)">
                        <i class="pi pi-times"></i>
                      </button>
                    </td>
                  </tr>
                  <tr style="border-top:2px solid #1e293b;">
                    <td colspan="4" style="padding:8px 10px; color:#64748b; font-size:12px; text-align:right;">UKUPNO:</td>
                    <td style="padding:8px 10px; text-align:right; color:#f1f5f9; font-weight:700; font-size:14px;">{{ materialsTotal | number:'1.2-2' }}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div *ngIf="orderMaterials.length === 0" style="color:#475569; font-size:14px; padding:0 0 12px;">
              Nema materijala na ovom nalogu.
            </div>

            <!-- Forma za dodavanje -->
            <div style="display:grid; grid-template-columns:2fr 1fr 1fr auto; gap:8px; align-items:end; margin-top:8px;">
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Materijal</label>
                <select [(ngModel)]="newMat.materialId"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%;">
                  <option [ngValue]="null" disabled>Izaberi...</option>
                  <option *ngFor="let mat of allMaterials" [ngValue]="mat.id">{{ mat.name }}</option>
                </select>
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Količina</label>
                <input type="number" [(ngModel)]="newMat.quantity" min="0" step="0.01"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <div class="form-field" style="margin:0;">
                <label style="font-size:12px;">Cena/jm</label>
                <input type="number" [(ngModel)]="newMat.pricePerUnit" min="0" step="1"
                  style="background:#0f172a; border:1px solid #334155; border-radius:8px; color:#e2e8f0; padding:9px 12px; font-size:14px; outline:none; width:100%; box-sizing:border-box;" />
              </div>
              <button class="btn btn-primary" style="padding:9px 16px;"
                [disabled]="!newMat.materialId || newMat.quantity <= 0"
                (click)="addMaterial()">
                <i class="pi pi-plus"></i> Dodaj
              </button>
            </div>
            <div *ngIf="newMat.materialId && newMat.quantity > 0 && newMat.pricePerUnit > 0"
              style="text-align:right; font-size:13px; color:#7dd3fc; margin-top:6px;">
              = {{ (newMat.quantity * newMat.pricePerUnit) | number:'1.2-2' }}
            </div>

          </div>
        </div>

      </div>
    </p-dialog>
  `
})
export class ServiceOrdersComponent implements OnInit {
  orders: ServiceOrder[] = [];
  vehicles: Vehicle[] = [];
  clients: Client[] = [];
  allActivities: ServiceActivity[] = [];
  allOperations: ServiceOperation[] = [];
  loading = false;
  submitted = false;
  modalVisible = false;
  activeFormTab = 'activities';

  editingOrder: ServiceOrder | null = null;
  selectedClientId: number | null = null;

  orderActivities: ServiceActivity[] = [];
  orderActivitiesLoading = false;
  selectedActivityId: number | null = null;
  applyingDefaultsId: number | null = null;
  applyDefaultsMessage = '';

  orderOperations: ServiceOrderOperation[] = [];
  orderOperationsLoading = false;
  newOp: { operationId: number | null; workHours: number; pricePerHour: number } =
    { operationId: null, workHours: 0, pricePerHour: 0 };

  allMaterials: any[] = [];
  orderMaterials: ServiceOrderMaterial[] = [];
  orderMaterialsLoading = false;
  newMat: { materialId: number | null; quantity: number; pricePerUnit: number } =
    { materialId: null, quantity: 0, pricePerUnit: 0 };

  form = this.fb.group({
    vehicleId: [null as number | null, Validators.required],
    description: ['', Validators.required],
    date: [this.todayStr(), Validators.required],
    mileage: [0, [Validators.required, Validators.min(0)]],
    status: ['Open']
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
    this.api.getVehicles().subscribe(v => this.vehicles = v);
    this.api.getClients().subscribe(c => this.clients = c.filter(x => x.isActive));
    this.api.getServiceActivities().subscribe(a => this.allActivities = a.filter(x => x.isActive));
    this.api.getServiceOperations().subscribe(o => this.allOperations = o.filter(x => x.isActive));
    this.api.getMaterials().subscribe(m => this.allMaterials = m.filter((x: any) => x.isActive));
  }

  get filteredVehicles(): Vehicle[] {
    const active = this.vehicles.filter(v => v.isActive);
    return this.selectedClientId
      ? active.filter(v => v.clientId === this.selectedClientId)
      : active;
  }

  onClientChange(clientId: number | null) {
    this.selectedClientId = clientId;
    this.form.get('vehicleId')!.setValue(null);
  }

  getClientForVehicle(vehicleId: number): string {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle?.clientId) return '';
    return vehicle.clientName ?? this.clients.find(c => c.id === vehicle.clientId)?.name ?? '';
  }

  load() {
    this.loading = true;
    this.api.getServiceOrders().subscribe({
      next: orders => { this.orders = orders; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  openModal() {
    this.editingOrder = null;
    this.submitted = false;
    this.activeFormTab = 'activities';
    this.selectedClientId = null;
    this.form.reset({
      vehicleId: null,
      description: '',
      date: this.todayStr(),
      mileage: 0,
      status: 'Open'
    });
    this.form.get('vehicleId')!.setValidators(Validators.required);
    this.form.get('vehicleId')!.updateValueAndValidity();
    this.modalVisible = true;
  }

  openEdit(order: ServiceOrder) {
    this.editingOrder = order;
    this.submitted = false;
    this.activeFormTab = 'activities';
    this.orderActivities = [];
    this.orderOperations = [];
    this.orderMaterials = [];
    this.selectedActivityId = null;
    this.applyingDefaultsId = null;
    this.applyDefaultsMessage = '';
    this.newOp = { operationId: null, workHours: 0, pricePerHour: 0 };
    this.newMat = { materialId: null, quantity: 0, pricePerUnit: 0 };
    this.form.reset({
      vehicleId: order.vehicleId,
      description: order.description,
      date: order.date,
      mileage: order.mileage,
      status: order.status
    });
    this.selectedClientId = this.vehicles.find(v => v.id === order.vehicleId)?.clientId ?? null;
    this.form.get('vehicleId')!.setValidators(Validators.required);
    this.form.get('vehicleId')!.updateValueAndValidity();
    this.modalVisible = true;
    this.loadOrderActivities();
  }

  closeModal() {
    this.modalVisible = false;
    this.editingOrder = null;
    this.orderActivities = [];
    this.orderOperations = [];
    this.orderMaterials = [];
    this.applyingDefaultsId = null;
    this.applyDefaultsMessage = '';
  }

  loadOrderActivities() {
    if (!this.editingOrder) return;
    this.orderActivitiesLoading = true;
    this.api.getActivitiesByOrder(this.editingOrder.id).subscribe({
      next: data => { this.orderActivities = data; this.orderActivitiesLoading = false; },
      error: () => { this.orderActivitiesLoading = false; }
    });
  }

  get availableActivities(): ServiceActivity[] {
    const linked = new Set(this.orderActivities.map(a => a.id));
    return this.allActivities.filter(a => !linked.has(a.id));
  }

  addActivity() {
    if (!this.editingOrder || !this.selectedActivityId) return;
    this.api.addActivityToOrder(this.editingOrder.id, this.selectedActivityId).subscribe(() => {
      this.selectedActivityId = null;
      this.loadOrderActivities();
    });
  }

  removeActivity(activityId: number) {
    if (!this.editingOrder) return;
    this.api.removeActivityFromOrder(this.editingOrder.id, activityId).subscribe(() => {
      this.loadOrderActivities();
    });
  }

  applyDefaults(activityId: number) {
    if (!this.editingOrder) return;
    this.applyingDefaultsId = activityId;
    this.api.applyActivityDefaultsToOrder(this.editingOrder.id, activityId).subscribe({
      next: result => {
        this.applyDefaultsMessage = `Dodato operacija: ${result.operationsAdded}, materijala: ${result.materialsAdded}.`;
        this.applyingDefaultsId = null;
        this.loadOrderOperations();
        this.loadOrderMaterials();
        setTimeout(() => {
          this.applyDefaultsMessage = '';
        }, 3000);
      },
      error: () => { this.applyingDefaultsId = null; }
    });
  }

  // ─── Servisne operacije ───────────────────────────────────

  switchToOperations() {
    this.activeFormTab = 'operations';
    if (this.editingOrder && this.orderOperations.length === 0 && !this.orderOperationsLoading) {
      this.loadOrderOperations();
    }
  }

  loadOrderOperations() {
    if (!this.editingOrder) return;
    this.orderOperationsLoading = true;
    this.api.getOperationsByOrder(this.editingOrder.id).subscribe({
      next: data => { this.orderOperations = data; this.orderOperationsLoading = false; },
      error: () => { this.orderOperationsLoading = false; }
    });
  }

  get operationsTotal(): number {
    return this.orderOperations.reduce((sum, op) => sum + op.totalPrice, 0);
  }

  onOperationSelect(id: number | null) {
    const op = this.allOperations.find(o => o.id === id);
    if (op) { this.newOp.workHours = Number(op.workHours); }
  }

  addOperation() {
    if (!this.editingOrder || !this.newOp.operationId) return;
    this.api.addOperationToOrder(this.editingOrder.id, {
      serviceOperationId: this.newOp.operationId,
      workHours: this.newOp.workHours,
      pricePerHour: this.newOp.pricePerHour
    }).subscribe(() => {
      this.newOp = { operationId: null, workHours: 0, pricePerHour: 0 };
      this.loadOrderOperations();
    });
  }

  removeOperation(rowId: number) {
    if (!this.editingOrder) return;
    this.api.removeOperationFromOrder(this.editingOrder.id, rowId).subscribe(() => {
      this.loadOrderOperations();
    });
  }

  // ─── Materijali ───────────────────────────────────────────

  switchToMaterials() {
    this.activeFormTab = 'materials';
    if (this.editingOrder && this.orderMaterials.length === 0 && !this.orderMaterialsLoading) {
      this.loadOrderMaterials();
    }
  }

  loadOrderMaterials() {
    if (!this.editingOrder) return;
    this.orderMaterialsLoading = true;
    this.api.getMaterialsByOrder(this.editingOrder.id).subscribe({
      next: data => { this.orderMaterials = data; this.orderMaterialsLoading = false; },
      error: () => { this.orderMaterialsLoading = false; }
    });
  }

  get materialsTotal(): number {
    return this.orderMaterials.reduce((sum, m) => sum + m.totalPrice, 0);
  }

  addMaterial() {
    if (!this.editingOrder || !this.newMat.materialId) return;
    this.api.addMaterialToOrder(this.editingOrder.id, {
      materialId: this.newMat.materialId,
      quantity: this.newMat.quantity,
      pricePerUnit: this.newMat.pricePerUnit
    }).subscribe(() => {
      this.newMat = { materialId: null, quantity: 0, pricePerUnit: 0 };
      this.loadOrderMaterials();
    });
  }

  removeMaterial(rowId: number) {
    if (!this.editingOrder) return;
    this.api.removeMaterialFromOrder(this.editingOrder.id, rowId).subscribe(() => {
      this.loadOrderMaterials();
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    if (this.editingOrder) {
      this.api.updateServiceOrder(this.editingOrder.id, {
        vehicleId: v.vehicleId!,
        description: v.description!,
        status: v.status as any,
        date: v.date!,
        mileage: v.mileage!
      }).subscribe(() => {
        this.closeModal();
        this.load();
      });
    } else {
      this.api.createServiceOrder({
        vehicleId: v.vehicleId!,
        description: v.description!,
        date: v.date!,
        mileage: v.mileage!
      }).subscribe(() => {
        this.closeModal();
        this.load();
      });
    }
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

  private todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }
}
