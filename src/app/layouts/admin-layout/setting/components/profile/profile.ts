import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingService } from '../../../../../core/services/setting.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit {

  private settingService = inject(SettingService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  loading = false;
  profileData: any = {};
  selectedFile: File | null = null;

  ngOnInit() {
    this.initForm();
    this.getProfile();
  }

  initForm() {
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  getProfile() {
    this.loading = true;

    this.settingService.getProfile().subscribe({
      next: (res: any) => {
        this.loading = false;
        this.profileData = res.data;

        this.profileForm.patchValue({
          first_name: res.data.first_name,
          last_name: res.data.last_name,
          email: res.data.email,
          phone: res.data.phone,
        });
      },
      error: (err) => {
        this.loading = false;
        console.error("Profile load error:", err);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    const formData = new FormData();
    formData.append("first_name", this.profileForm.value.first_name);
    formData.append("last_name", this.profileForm.value.last_name);
    formData.append("email", this.profileForm.value.email);
    formData.append("phone", this.profileForm.value.phone || '');

    if (this.selectedFile) {
      formData.append("profile_image", this.selectedFile);
    }

    // this.settingService.updateProfile(formData).subscribe({
    //   next: (res: any) => {
    //     alert("Profile updated successfully");
    //     this.getProfile();
    //   },
    //   error: (err) => {
    //     console.error("Update error:", err);
    //   }
    // });
  }

}
