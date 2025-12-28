// sidebar.component.ts
import { Component, Input, Output, signal, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarItem } from '../../../../core/models/sidebar-item.model';
import { ScreenHelper } from '../../../../core/utils/device-info.util';
import { getRoleFromStorage } from '../../../../core/utils/device-info.util';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent {
  @Input() items: SidebarItem[] = [];
  @Input() collapsed = false;
  @Output() isMobiletoggleSidebar = new EventEmitter<void>();
  checkDeviceType = signal<boolean>(ScreenHelper.isMobile());
  userRole = signal<string | null>(getRoleFromStorage());
  h2Heading = signal<string>('');
  h2Span = signal<string>('');
  constructor() {
    // Listen to window resize events to update device type
    if (this.userRole() === 'admin') {
      this.h2Heading.set('Admin Panel');
      this.h2Span.set('Administrator');
    }
    else if (this.userRole() === 'staff') {
      this.h2Heading.set('Staff Dashboard');
      this.h2Span.set('Staff Member');
    } else {
      this.h2Heading.set('Customer Portal');
      this.h2Span.set('Customer');
    }
  }
}
