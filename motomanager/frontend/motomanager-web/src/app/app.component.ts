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
          <img src="images/logo.png" alt="BMW Moto Garaža" style="width:128px; display:block;" />
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
          <a routerLink="/codebooks" routerLinkActive="active">
            <i class="pi pi-book"></i> Šifarnici
          </a>
        </div>
      </nav>
      <main class="app-main">
        <div class="app-content">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `
})
export class AppComponent {}
