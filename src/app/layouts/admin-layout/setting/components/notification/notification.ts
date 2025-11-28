import { Component, OnInit, inject, signal } from '@angular/core';
import { SettingService } from '../../../../../core/services/setting.service';
import { NotificationService } from '../../../../../public/notification.service';
@Component({
  selector: 'app-notification',
  imports: [],
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  private settingService = inject(SettingService);
  private notificationService = inject(NotificationService);
  notificationSettings = signal<any>(null);
  loading = false;
  ngOnInit() {
    this.getNotificationSettings();
  }

  getNotificationSettings() {
    this.loading = true;
    this.settingService.getNotificationSettings().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notificationSettings.set(res.data);
      }
    });
  }

  // updateNotificationSettings() {
  //   this.loading = true;
  //   this.settingService.updateSettings(this.notificationSettings()).subscribe({
  //     next: (res: any) => {
  //       this.loading = false;
  //       this.notificationService.show('Notification settings updated successfully', 'success');
  //     },
  //     error: (err: any) => {
  //       this.loading = false;
  //       this.notificationService.show('Failed to update notification settings', 'error');
  //     }
  //   });
  // }
}