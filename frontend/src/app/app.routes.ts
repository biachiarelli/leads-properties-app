import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { LeadsListComponent } from './features/leads/pages/leads-list/leads-list.component';
import { LeadDetailComponent } from './features/leads/pages/lead-detail/lead-detail.component';
import { PropertiesListComponent } from './features/properties/pages/properties-list/properties-list.component';
import { PropertyDetailComponent } from './features/properties/pages/property-detail/property-detail.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'leads', component: LeadsListComponent },
  { path: 'leads/:id', component: LeadDetailComponent },
  { path: 'properties', component: PropertiesListComponent },
  { path: 'properties/:id', component: PropertyDetailComponent },
];
