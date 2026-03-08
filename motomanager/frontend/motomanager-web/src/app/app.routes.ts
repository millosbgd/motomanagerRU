import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home.component';
import { VehiclesComponent } from './pages/vehicles.component';
import { ServiceOrdersComponent } from './pages/service-orders.component';
import { CodebooksComponent } from './pages/codebooks.component';
import { ClientsComponent } from './pages/clients.component';
import { ServiceActivitiesComponent } from './pages/service-activities.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'clients', component: ClientsComponent },
  { path: 'service-orders', component: ServiceOrdersComponent },
  { path: 'service-activities', component: ServiceActivitiesComponent },
  { path: 'codebooks', component: CodebooksComponent },
  { path: '**', redirectTo: '' }
];
