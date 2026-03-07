import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { Vehicle } from '../models/vehicle';

@Component({
  standalone: true,
  selector: 'app-vehicles',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-header">
      <h1>Vozila</h1>
      <p>Evidencija svih registrovanih vozila</p>
    </div>

    <div class="form-card">
      <h2>Dodaj novo vozilo</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="form-grid">
          <div class="form-field">
            <label>Registracija *</label>
            <input formControlName="registration" placeholder="npr. BG-123-AB"
              [class.error]="submitted && form.get('registration')?.invalid" />
            <span class="field-error" *ngIf="submitted && form.get('registration')?.invalid">
              Obavezno polje
            </span>
          </div>
          <div class="form-field">
            <label>Marka *</label>
            <input formControlName="make" placeholder="npr. BMW"
              [class.error]="submitted && form.get('make')?.invalid" />
            <span class="field-error" *ngIf="submitted && form.get('make')?.invalid">
              Obavezno polje
            </span>
          </div>
          <div class="form-field">
            <label>Model *</label>
            <input formControlName="model" placeholder="npr. R 1250 GS"
              [class.error]="submitted && form.get('model')?.invalid" />
            <span class="field-error" *ngIf="submitted && form.get('model')?.invalid">
              Obavezno polje
            </span>
          </div>
          <div class="form-field">
            <label>Godina</label>
            <input formControlName="year" type="number" placeholder="npr. 2022"
              [class.error]="submitted && form.get('year')?.invalid" />
            <span class="field-error" *ngIf="submitted && form.get('year')?.invalid">
              1950 &mdash; {{ currentYear }}
            </span>
          </div>
          <div class="form-field" style="justify-content: flex-end;">
            <button type="submit" class="btn btn-primary">
              <i class="pi pi-plus"></i> Dodaj vozilo
            </button>
          </div>
        </div>
      </form>
    </div>

    <div class="data-card">
      <div class="data-card-header">
        <h2>Lista vozila</h2>
        <span class="count-badge">{{ vehicles.length }} vozila</span>
      </div>
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Registracija</th>
            <th>Marka</th>
            <th>Model</th>
            <th>Godina</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngIf="vehicles.length === 0" class="empty-row">
            <td colspan="6">
              <i class="pi pi-car" style="font-size:24px; color:#334155; display:block; margin-bottom:8px;"></i>
              Nema vozila. Dodaj prvo vozilo.
            </td>
          </tr>
          <tr *ngFor="let v of vehicles">
            <td style="color:#475569; font-size:13px;">{{ v.id }}</td>
            <td><strong style="color:#f1f5f9;">{{ v.registration }}</strong></td>
            <td>{{ v.make }}</td>
            <td>{{ v.model }}</td>
            <td>{{ v.year || '&mdash;' }}</td>
            <td>
              <span class="badge" [class.badge-open]="v.isActive" [class.badge-closed]="!v.isActive">
                {{ v.isActive ? 'Aktivno' : 'Neaktivno' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];
  submitted = false;
  currentYear = new Date().getFullYear();

  form = this.fb.group({
    registration: ['', Validators.required],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null, [Validators.min(1950), Validators.max(new Date().getFullYear() + 1)]]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() { this.load(); }

  load() {
    this.api.getVehicles().subscribe(vehicles => this.vehicles = vehicles);
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.api.createVehicle(this.form.getRawValue() as any).subscribe(() => {
      this.form.reset();
      this.submitted = false;
      this.load();
    });
  }
}
