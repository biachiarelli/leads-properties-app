import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menu',
  imports: [
    CommonModule,
    MenubarModule,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-chart-bar',
      routerLink: '/dashboard',
    },
    {
      label: 'Leads',
      icon: 'pi pi-users',
      routerLink: '/leads',
    },
    {
      label: 'Propriedades',
      icon: 'pi pi-map',
      routerLink: '/properties',
    },
  ];
}
