import { Component, inject, signal } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../../core/models/sidebar-item.model';
import { Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../../shared/navbar/navbar';

@Component({
  selector: 'app-staff-dashboard',
  imports: [SidebarComponent, CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.css',
})
export class StaffDashboard {
  private readonly initialSidebarItems: SidebarItem[] = [
    { label: 'My Dashboard', icon: 'fas fa-home', route: '/staff/dashboard' },
    { label: 'Todays Schedule', icon: 'far fa-calendar-alt', route: '/staff/appointments' },
    { label: 'My Clients', icon: 'fas fa-user-friends', route: '/staff/my-clients' },
    { label: 'Services', icon: 'fas fa-scissors', route: '/staff/services' },
    { label: 'Performance', icon: 'fas fa-chart-bar', route: '/staff/analytics' },
    { label: 'Settings', icon: 'fas fa-cog', route: '/staff/settings' },
  ];
  readonly #router = inject(Router);
  protected collapsed = signal<boolean>(false);
  protected sidebarOpen = signal<boolean>(false);
  protected readonly sidebarItems = signal<SidebarItem[]>(this.initialSidebarItems);
  get activeRoute(): string {
    return this.#router.url;
  }

  toggleSidebar(): void {
    // On small screens, open an overlay sidebar; on larger screens, toggle collapse
    if (typeof window !== 'undefined' && window.innerWidth <= 640) {
      this.sidebarOpen.update((v) => !v);
    } else {
      this.collapsed.update((current) => !current);
    }
  }

  closeMobileSidebar(): void {
    this.sidebarOpen.set(false);
  }

  isMobileToggleSidebar(): void {
    this.sidebarOpen.update((v) => !v);
  }
}
