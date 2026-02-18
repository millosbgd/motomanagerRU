import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ServiceOrder, ServiceOrderStatus } from '../models/service-order';

@Component({
  standalone: true,
  selector: 'app-service-orders',
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <h2>Servisni nalozi</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="row">
          <input placeholder="Vehicle ID" type="number" formControlName="vehicleId" />
          <input placeholder="Opis" formControlName="description" />
          <button type="submit" [disabled]="form.invalid">Dodaj</button>
        </div>
      </form>
    </div>

    <div class="card">
      <div class="list">
        <div *ngFor="let o of orders" class="row">
          <strong>#{{ o.id }}</strong>
          <span>Vozilo: {{ o.vehicleId }}</span>
          <span>{{ o.description }}</span>
          <span>Status: {{ o.status }}</span>
          <button *ngIf="o.status !== 'Closed'" (click)="close(o)">Zatvori</button>
        </div>
      </div>
    </div>
  `
})
export class ServiceOrdersComponent implements OnInit {
  orders: ServiceOrder[] = [];

  form = this.fb.group({
    vehicleId: [null as number | null, Validators.required],
    description: ['', Validators.required]
  });

  constructor(private api: ApiService, private fb: FormBuilder) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.api.getServiceOrders().subscribe(orders => (this.orders = orders));
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    this.api.createServiceOrder(this.form.getRawValue()).subscribe(() => {
      this.form.reset();
      this.load();
    });
  }

  close(order: ServiceOrder) {
    this.api.closeServiceOrder(order.id).subscribe(() => this.load());
  }
}
