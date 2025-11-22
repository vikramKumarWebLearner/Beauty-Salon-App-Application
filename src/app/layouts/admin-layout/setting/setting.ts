import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Profile } from './components/profile/profile';
import { Notification } from './components/notification/notification';
@Component({
  selector: 'app-setting',
  imports: [CommonModule, LucideAngularModule, Profile, Notification],
  templateUrl: './setting.html',
  styleUrl: './setting.css',
})
export class Setting {

  selectedTab = signal('Profile');

  tabs = [
    { label: 'Profile', value: 'Profile', icon: 'user' },
    { label: 'Notification', value: 'Notification', icon: 'bell' },
    { label: 'Security', value: 'Security', icon: 'shield' },
    { label: 'Appearance', value: 'Appearance', icon: 'palette' }
  ];

  onTabClick(value: string) {
    this.selectedTab.set(value);  // ✔️ update signal
  }

  isActive(value: string): boolean {
    return this.selectedTab() === value; // ✔️ read signal
  }
}
