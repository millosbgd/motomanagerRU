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
    <div class="card">
      <h2>Vozila</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="row">
          <input placeholder="Registracija" formControlName="registration" />
          <input placeholder="Marka" formControlName="make" />
          <input placeholder="Model" formControlName="model" />
          <input placeholder="Godina" type="number" formControlName="year" />
          <button type="submit" [disabled]="form.invalid">Dodaj</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="list">
        <div *ngFor="let v of vehicles" class="row">
          <strong>{{ v.registration }}</strong>
          <span>{{ v.make }} {{ v.model }}</span>
          <span *ngIf="v.year">({{ v.year }})</span>
        </div>
      </div>
    </div>
  `
})
export class VehiclesComponent implements OnInit {
  vehicles: Vehicle[] = [];

  form = this.fb.group({
    registration: ['', Validators.required],
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: [null as number | null]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getVehicles().subscribe(vehicles => (this.vehicles = vehicles));
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.api.createVehicle(this.form.getRawValue()).subscribe(() => {
      this.form.reset();
      this.load();
    });
  }
}
