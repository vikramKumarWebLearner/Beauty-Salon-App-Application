import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

// Modern type definitions
type UserType = 'customer' | 'staff' | 'admin';

interface LoginForm {
    email: FormControl<string>;
    password: FormControl<string>;
    // userType: FormControl<UserType>;
}

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
})
export class LoginComponent {
    // Modern dependency injection
    readonly #authService = inject(AuthService);
    readonly #router = inject(Router);
    readonly #notificationService = inject(NotificationService);

    // Signal-based state management
    readonly errorMessage = signal('');
    readonly isLoading = signal(false);

    // Modern FormGroup with typed controls
    readonly loginForm = new FormGroup<LoginForm>({
        email: new FormControl('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true
        }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(6)],
            nonNullable: true
        }),
        // userType: new FormControl<UserType>('customer', {
        //     validators: [Validators.required],
        //     nonNullable: true
        // })
    });

    // Computed signals for form validation state
    readonly isFormValid = computed(() => this.loginForm.valid);
    readonly isFormInvalid = computed(() => this.loginForm.invalid);

    constructor() {
        // Modern effect for reactive form state management
        effect(() => {
            // Log form validation state changes in development
            if (!this.isFormValid()) {
                console.debug('Form validation state changed:', {
                    valid: this.isFormValid(),
                    errors: this.loginForm.errors
                });
            }
        });
    }

    // Helper methods for template using modern patterns
    getFieldError(fieldName: keyof typeof this.loginForm.controls): string {
        const field = this.loginForm.controls[fieldName];
        if (field.invalid && (field.dirty || field.touched)) {
            const errors = field.errors;
            if (errors?.['required']) {
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
            }
            if (errors?.['email']) {
                return 'Please enter a valid email address';
            }
            if (errors?.['minlength']) {
                return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${errors['minlength'].requiredLength} characters long`;
            }
        }
        return '';
    }

    hasFieldError(fieldName: keyof typeof this.loginForm.controls): boolean {
        const field = this.loginForm.controls[fieldName];
        return field.invalid && (field.dirty || field.touched);
    }

    onFieldInput(): void {
        // Clear general error message when user starts typing
        if (this.errorMessage()) {
            this.errorMessage.set('');
        }
    }

    onSignIn(): void {
        // Mark all fields as touched to show validation errors
        this.loginForm.markAllAsTouched();

        // Check if form is valid using computed signal
        if (this.isFormInvalid()) {
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        // Get form values with proper typing
        const { email, password } = this.loginForm.getRawValue();

        this.#authService.login({ email, password }).subscribe({
            next: (res) => {
                this.isLoading.set(false);

                // Token and role are already saved by the auth service in the tap operator
                // Get the role from storage to ensure we have the correct value
                const storedRole = this.#authService.getUserRole();
                const roleToUse = storedRole || 'customer'; // Fallback to form value if API didn't provide role

                // If API didn't provide a role, save the form value
                if (!storedRole) {
                    this.#authService.setUserRole(roleToUse);
                }

                // Show success message
                this.#notificationService.showLoginSuccess(roleToUse);

                // Modern switch with proper typing
                const routes: Record<UserType, string[]> = {
                    admin: ['/admin/dashboard'],
                    staff: ['/staff/dashboard'],
                    customer: ['/customer/dashboard']
                } as const;

                // Navigate after a short delay to let user see the success message
                setTimeout(() => {
                    this.#router.navigate(routes[roleToUse as UserType]);
                }, 1000);
            },
            error: (err) => {
                this.isLoading.set(false);
                const errorMessage = err.error?.message || err.message || 'Login failed. Please try again.';
                this.errorMessage.set(errorMessage);
                this.#notificationService.showError(errorMessage, 'Login Failed');
            }
        });
    }

    // Test methods for toast notifications
    testSuccess(): void {
        this.#notificationService.showSuccess('This is a test success message!', 'Test Success');
    }

    testError(): void {
        this.#notificationService.showError('This is a test error message!', 'Test Error');
    }

    testInfo(): void {
        this.#notificationService.showInfo('This is a test info message!', 'Test Info');
    }

    testWarning(): void {
        this.#notificationService.showWarning('This is a test warning message!', 'Test Warning');
    }
}
