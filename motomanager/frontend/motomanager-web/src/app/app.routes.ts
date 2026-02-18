import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { VehiclesComponent } from './pages/vehicles.component';
import { ServiceOrdersComponent } from './pages/service-orders.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'service-orders', component: ServiceOrdersComponent },
  { path: '**', redirectTo: '' }
];
