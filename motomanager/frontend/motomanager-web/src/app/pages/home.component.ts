import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-home',
  template: `
    <div class="card">
      <h2>Dobrodošli u MotoManager</h2>
      <p>MVP aplikacija za evidenciju vozila i servisnih naloga.</p>
    </div>
  `
})
export class HomeComponent {}
