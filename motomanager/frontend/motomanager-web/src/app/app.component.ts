import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <nav class="app-navbar">
      <div class="brand">
        <span>&#x1F3CD;</span> MotoManager
      </div>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
        <i class="pi pi-home"></i> Dashboard
      </a>
      <a routerLink="/vehicles" routerLinkActive="active">
        <i class="pi pi-car"></i> Vozila
      </a>
      <a routerLink="/service-orders" routerLinkActive="active">
        <i class="pi pi-wrench"></i> Servisni nalozi
      </a>
    </nav>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
