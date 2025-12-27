import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../../app/public/notification.service';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    templateUrl: './forgot-password.component.html',
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
})
export class ForgotPasswordComponent {
    // Component logic goes here
    private authService = inject(AuthService);
    private toast = inject(NotificationService);
    private router = inject(Router);

    forgetPasswordForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });
    isLoading = signal(false);
    readonly errorMessage = signal('');

    getFieldError(fieldName: string): string | null {
        const control = this.forgetPasswordForm.get(fieldName);
        if (control && control.touched && control.errors) {
            if (control.errors['required']) {
                return 'This field is required';
            }
            if (control.errors['email']) {
                return 'Please enter a valid email address';
            }
        }
        return null;
    }

    hasFieldError(fieldName: keyof typeof this.forgetPasswordForm.controls): boolean {
        const field = this.forgetPasswordForm.controls[fieldName];
        return field.invalid && (field.dirty || field.touched);
    }
    onFieldInput(): void {
        // Clear general error message when user starts typing
        if (this.errorMessage()) {
            this.errorMessage.set('');
        }
    }
    onForgotPassword(): void {
        if (this.forgetPasswordForm.invalid) {
            this.forgetPasswordForm.markAllAsTouched();
            return;
        }
        this.isLoading.set(true);
        const email = this.forgetPasswordForm.value.email!;
        this.authService.forgotPassword({ email }).subscribe({
            next: (response: any) => {
                this.isLoading.set(false);
                this.toast.show(response.message, 'success');
                this.router.navigate(['/auth/login']);
            },
            error: (error: any) => {
                this.isLoading.set(false);
                this.toast.show(error?.error?.message || 'An error occurred. Please try again.', 'error');
            }
        });
    }


}