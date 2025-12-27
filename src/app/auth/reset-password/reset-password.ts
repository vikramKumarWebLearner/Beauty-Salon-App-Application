import { Component, inject, signal, } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../../app/public/notification.service';
@Component({
  selector: 'app-reset-password',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private activatedRoute = inject(ActivatedRoute);

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly token = this.activatedRoute.snapshot.queryParamMap.get('token') || '';
  getFieldError(fieldName: string): string | null {
    const control = this.resetPasswordForm.get(fieldName);
    if (control && control.touched && control.errors) {
      if (control.errors['required']) {
        return 'New password is required';
      }
      if (control.errors['minlength']) {
        return 'New Password must be at least 6 characters long';
      }
      if (fieldName === 'confirmPassword' && this.resetPasswordForm.errors?.['passwordMismatch']) {
        return 'Passwords do not match';
      }
    }
    return null;
  }

  hasFieldError(fieldName: keyof typeof this.resetPasswordForm.controls): boolean {
    const field = this.resetPasswordForm.controls[fieldName];
    return field.invalid && (field.dirty || field.touched);
  }

  onFieldInput(): void {
    // Clear general error message when user starts typing
    if (this.errorMessage()) {
      this.errorMessage.set('');
    }
  }

  onResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    const password = this.resetPasswordForm.value.password!;
    const confirmPassword = this.resetPasswordForm.value.confirmPassword!;
    if (password !== confirmPassword) {
      this.errorMessage.set('Passwords do not match');
      this.isLoading.set(false);
      return;
    }
    this.authService.resetPassword({ token: this.token, password: password, confirmPassword: confirmPassword }).subscribe({
      next: (response: any) => {
        this.isLoading.set(false);
        this.notificationService.show(response.message, 'success');
        this.router.navigate(['/auth/login']);
      },
      error: (error: any) => {
        this.isLoading.set(false);
        this.notificationService.show(error?.error?.message || 'An error occurred. Please try again.', 'error');
      }
    });
  }
}
