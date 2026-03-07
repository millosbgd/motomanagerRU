import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h1>Dashboard</h1>
      <p>Pregled stanja vozila i servisnih naloga</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">&#x1F697;</div>
        <div class="stat-label">Ukupno vozila</div>
        <div class="stat-value">{{ vehicleCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#x1F6E0;</div>
        <div class="stat-label">Servisnih naloga</div>
        <div class="stat-value">{{ orderCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#x2705;</div>
        <div class="stat-label">Zatvorenih naloga</div>
        <div class="stat-value">{{ closedCount }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">&#x1F504;</div>
        <div class="stat-label">Otvorenih naloga</div>
        <div class="stat-value">{{ openCount }}</div>
      </div>
    </div>

    <div class="form-card" style="display:flex; gap:12px; flex-wrap:wrap;">
      <a routerLink="/vehicles" class="btn btn-primary">
        <i class="pi pi-plus"></i> Dodaj vozilo
      </a>
      <a routerLink="/service-orders" class="btn" style="background:#1e3a5f; color:#60a5fa;">
        <i class="pi pi-plus"></i> Novi nalog
      </a>
    </div>
  `
})
export class HomeComponent implements OnInit {
  vehicleCount = 0;
  orderCount = 0;
  closedCount = 0;
  openCount = 0;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getVehicles().subscribe(v => this.vehicleCount = v.length);
    this.api.getServiceOrders().subscribe(o => {
      this.orderCount = o.length;
      this.closedCount = o.filter(x => x.status === 'Closed').length;
      this.openCount = o.filter(x => x.status !== 'Closed').length;
    });
  }
}
