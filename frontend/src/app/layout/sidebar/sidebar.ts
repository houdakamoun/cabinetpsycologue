import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service.ts';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  navItems: NavItem[] = [
    { label: 'Tableau de bord', route: '/admin/dashboard', icon: 'dashboard' },
    { label: 'Patients', route: '/admin/patients', icon: 'patients' },
    { label: 'Rendez-vous', route: '/admin/rendez-vous', icon: 'calendar' },
    { label: 'Calendrier', route: '/admin/calendrier', icon: 'cal-grid' },
    { label: 'Paiements', route: '/admin/paiements', icon: 'payments' },
  ];

  constructor(public auth: AuthService) {}

  logout(): void {
    this.auth.logout();
  }
}
