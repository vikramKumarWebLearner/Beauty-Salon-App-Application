import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../../core/models/sidebar-item.model';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar';
@Component({
  selector: 'app-admin-dashboard',
  imports: [SidebarComponent, CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboard {
  private readonly initialSidebarItems: SidebarItem[] = [
    { label: 'Dashboard', icon: 'fas fa-home', route: '/admin/dashboard' },
    { label: 'Appointments', icon: 'far fa-calendar-alt', route: '/admin/appointments' },
    { label: 'Shifts', icon: 'fas fa-clock', route: '/admin/shifts' },
    { label: 'Staff Management', icon: 'fas fa-user-friends', route: '/admin/staff-management' },
    { label: 'Services', icon: 'fas fa-scissors', route: '/admin/services' },
    { label: 'Analytics', icon: 'fas fa-chart-bar', route: '/admin/analytics' },
    { label: 'Inventory', icon: 'fas fa-box', route: '/admin/inventory' },
    { label: 'Payments', icon: 'fas fa-credit-card', route: '/admin/payments' },
    { label: 'Settings', icon: 'fas fa-cog', route: '/admin/settings' },
  ];
  readonly #router = inject(Router);
  protected collapsed = signal<boolean>(false);
  protected readonly sidebarItems = signal<SidebarItem[]>(this.initialSidebarItems);

  // protected sidebarOpen = signal<boolean>(true);

  get activeRoute(): string {
    return this.#router.url;
  }

  toggleSidebar(): void {
    this.collapsed.update((current) => !current);
  }
}
