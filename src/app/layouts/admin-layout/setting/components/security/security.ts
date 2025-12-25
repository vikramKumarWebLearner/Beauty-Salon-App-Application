import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Eye, EyeOff } from 'lucide-angular';
import { SettingService } from '../../../../../core/services/setting.service';
import { NotificationService } from '../../../../../../app/public/notification.service';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  FormGroup,
} from '@angular/forms';
import { AuthService } from '../../../../../core';
import { TimeAgoPipe } from '../../../../../shared/pipes/time-ago.pipe'
@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule, TimeAgoPipe],
  templateUrl: './security.html',
  styleUrls: ['./security.css'],
})
export class Security implements OnInit {
  settingService = inject(SettingService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);
  // ✅ Declare only
  passwordForm!: FormGroup;

  // 👁 Password visibility toggles
  showCurrent = signal(false);
  showNew = signal(false);
  showConfirm = signal(false);
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;

  userProfile = signal<string | null>(null);


  ngOnInit() {
    this.getUserProfile();
    this.getDeviceInfo();
  }

  getUserProfile() {
    this.settingService.getProfile().subscribe({
      next: (res: any) => {
        this.userProfile.set(res.data._id);
      }
    });
  }

  // ✅ Signals
  sessions = signal<any[]>([]);

  toggleCurrent() {
    this.showCurrent.update(v => !v);
  }

  toggleNew() {
    this.showNew.update(v => !v);
  }

  toggleConfirm() {
    this.showConfirm.update(v => !v);
  }
  constructor(private fb: FormBuilder) {
    // ✅ Initialize AFTER fb exists
    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.passwordMatchValidator }
    );
  }


  // ✅ Custom Validator
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('newPassword')?.value;
    const confirmPass = control.get('confirmPassword')?.value;

    return newPass === confirmPass
      ? null
      : { passwordMismatch: true };
  }

  updatePassword() {
    if (this.passwordForm.invalid) return;

    this.settingService
      .updatePassword(this.userProfile()!, this.passwordForm.value)
      .subscribe({
        next: () => {
          this.notificationService.show(
            'Password updated successfully',
            'success'
          );
          this.passwordForm.reset();
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        },
        error: (error) => {
          const apiErrors = error?.error?.errors;
          if (Array.isArray(apiErrors)) {
            apiErrors.forEach((err: any) => {
              const control = this.passwordForm.get(err.path);
              if (control) {
                control.setErrors({
                  apiError: err.msg
                });
                control.markAsTouched();
              }
            });
          }

          // this.notificationService.show(
          //   'Failed to update password',
          //   'error'
          // );
        }
      });
  }


  revokeSession(id: number) {
    this.sessions.update(list => list.filter(s => s.id !== id));
    console.log('Revoked session with id:', id);
  }

  getDeviceInfo() {
    this.settingService.getDeviceInfo(this.userProfile()!).subscribe({
      next: (res: any) => {
        const sessions = res.data.map((device: any) => ({
          id: device._id,
          device: `${device.brand} • ${device.deviceType} (${device.model})`,
          lastActive: device.updatedAt,
          current: device.deviceType === 'web' // simple logic
        }));

        this.sessions.set(sessions); // ✅ now works
      },
      error: (err) => {
        console.error('Failed to load devices', err);
      }
    });
  }

}
