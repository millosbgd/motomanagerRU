import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="app-layout">
      <nav class="app-sidebar">
        <div class="brand">
          <span>&#x1F3CD;</span> MotoManager
        </div>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <i class="pi pi-home"></i> Dashboard
          </a>
          <a routerLink="/vehicles" routerLinkActive="active">
            <i class="pi pi-car"></i> Vozila
          </a>
          <a routerLink="/service-orders" routerLinkActive="active">
            <i class="pi pi-wrench"></i> Servisni nalozi
          </a>
        </div>
      </nav>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `
})
export class AppComponent {}
