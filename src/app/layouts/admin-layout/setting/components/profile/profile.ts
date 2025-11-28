import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from '../../../../../core/services/setting.service';
import { NotificationService } from '../../../../../../app/public/notification.service';
import { LucideAngularModule } from 'lucide-angular';
import { Image } from './image/image';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, LucideAngularModule, Image],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  @ViewChild(Image) imageComponent!: Image;

  private settingService = inject(SettingService);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  profileForm!: FormGroup;
  profileData = signal<any>({});
  loading = false;
  selectedFile: File | null = null;

  profileImagePreview: string | null = null;

  ngOnInit() {
    this.initForm();
    this.getProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      bio: [''],
      address: [''],
    });
  }

  getProfile() {
    this.loading = true;

    this.settingService.getProfile().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.profileData.set(res.data);

        this.profileForm.patchValue({
          name: res.data?.name ?? '',
          email: res.data?.email ?? '',
          phone: res.data?.phone ?? '',
          bio: res.data?.bio ?? '',
          address: res.data?.location?.address ?? '',
        });

        if (res.data?.profile_image) {
          this.profileImagePreview = res.data.profile_image;
        }
      },

      error: (err) => {
        this.loading = false;
        console.error("Profile load error", err);
      }
    });
  }

  onFileSelected(event: any) {
    this.imageComponent.onFileSelected(event);
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.notificationService.show("Please fill required fields", 'error');
      return;
    }
    this.settingService.updateProfile(this.profileData()._id, this.profileForm.value).subscribe({
      next: (res: any) => {
        this.notificationService.show("Profile updated successfully", 'success');
        this.getProfile();
      },
      error: () => {
        this.notificationService.show("Something went wrong", 'error');
      }
    });
  }

  getInitials(name: string) {
    if (!name) return "U";
    const parts = name.split(" ");
    return parts.map(p => p[0]).join("").toUpperCase();
  }


}
