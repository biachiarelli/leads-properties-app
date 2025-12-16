import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LeadsListComponent } from './components/leads/leads-list/leads-list.component';
import { PropertiesListComponent } from './components/properties/properties-list/properties-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'leads', component: LeadsListComponent },
  { path: 'properties', component: PropertiesListComponent },
];
