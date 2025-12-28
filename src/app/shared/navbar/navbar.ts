import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { getRoleFromStorage } from '../../core/utils/device-info.util';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  private readonly authService = inject(AuthService);

  onLogout(): void {
    this.authService.logout();
  }

  userRole = signal<string | null>(getRoleFromStorage());
  h2Heading = signal<string>('');
  h2PTitle = signal<string>('');
  constructor() {
    // Listen to window resize events to update device type
    if (this.userRole() === 'admin') {
      this.h2Heading.set('Admin Dashboard');
      this.h2PTitle.set('Welcome back! Here\'s what\'s happening at your salon today.');
    }
    else if (this.userRole() === 'staff') {
      this.h2Heading.set('My Dashboard');
      this.h2PTitle.set('Manage your appointments');
    } else {
      this.h2Heading.set('My Beauty Journey');
      this.h2PTitle.set('Welcome back! Your next appointment is coming up soon.');
    }
  }
}
