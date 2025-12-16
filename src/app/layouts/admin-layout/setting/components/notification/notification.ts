import { Component, OnInit, inject, signal, WritableSignal } from '@angular/core';
import { SettingService } from '../../../../../core/services/setting.service';
import { NotificationService } from '../../../../../public/notification.service';
import { NotificationSettings } from '../../../../../core/models/notification.model';
@Component({
  selector: 'app-notification',
  templateUrl: './notification.html',
  styleUrl: './notification.css',
})
export class Notification implements OnInit {
  private settingService = inject(SettingService);
  private notificationService = inject(NotificationService);

  loading = false;

  notificationSettings: WritableSignal<NotificationSettings> = signal({
    email: true,
    sms: false,
    push: true,
    marketing: false,
    appointment_reminders: true,
    booking_confirmations: true,
    cancellations: false,
    daily_summary: true,
  });

  ngOnInit() {
    this.getNotificationSettings();
  }

  getNotificationSettings() {
    this.loading = true;
    this.settingService.getNotificationSettings().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notificationSettings.set(res.data[0].value);
      },
      error: () => (this.loading = false),
    });
  }

  toggle(key: keyof NotificationSettings) {
    this.notificationSettings.update((state) => ({
      ...state,
      [key]: !state[key],
    }));
  }

  save() {
    this.loading = true;
    this.settingService.updateSettings(this.notificationSettings()).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.notificationService.show(
          'Notification settings updated successfully',
          'success'
        );
        this.notificationSettings.set(res.data.value);
      },
      error: () => {
        this.loading = false;
        this.notificationService.show(
          'Failed to update notification settings',
          'error'
        );
      },
    });
  }
}
