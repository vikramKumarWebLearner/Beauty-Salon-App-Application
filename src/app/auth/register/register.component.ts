import { Component, inject, signal, computed, effect } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

// Modern type definitions
type UserType = 'customer' | 'staff';

interface RegisterForm {
    name: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    password: FormControl<string>;
    confirmPassword: FormControl<string>;
    userType: FormControl<UserType>;
    agreeTerms: FormControl<boolean>;
}

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
        return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register.component.html',
})
export class RegisterComponent {
    // Modern dependency injection
    readonly #authService = inject(AuthService);
    readonly #router = inject(Router);
    readonly #notificationService = inject(NotificationService);

    // Signal-based state management
    readonly errorMessage = signal('');
    readonly isLoading = signal(false);

    // Modern FormGroup with typed controls
    readonly registerForm = new FormGroup<RegisterForm>({
        name: new FormControl('', {
            validators: [Validators.required, Validators.minLength(2)],
            nonNullable: true
        }),
        email: new FormControl('', {
            validators: [Validators.required, Validators.email],
            nonNullable: true
        }),
        phone: new FormControl('', {
            validators: [Validators.required, Validators.pattern(/^[\+]?[1-9][\d]{0,15}$/)],
            nonNullable: true
        }),
        password: new FormControl('', {
            validators: [Validators.required, Validators.minLength(8)],
            nonNullable: true
        }),
        confirmPassword: new FormControl('', {
            validators: [Validators.required],
            nonNullable: true
        }),
        userType: new FormControl<UserType>('customer', {
            validators: [Validators.required],
            nonNullable: true
        }),
        agreeTerms: new FormControl(false, {
            validators: [Validators.requiredTrue],
            nonNullable: true
        })
    }, { validators: passwordMatchValidator });

    // Computed signals for form validation state
    readonly isFormValid = computed(() => this.registerForm.valid);
    readonly isFormInvalid = computed(() => this.registerForm.invalid);

    constructor() {
        // Modern effect for reactive form state management
        effect(() => {
            // Log form validation state changes in development
            if (!this.isFormValid()) {
                console.debug('Form validation state changed:', {
                    valid: this.isFormValid(),
                    errors: this.registerForm.errors
                });
            }
        });
    }

    // Helper methods for template using modern patterns
    getFieldError(fieldName: keyof typeof this.registerForm.controls): string {
        const field = this.registerForm.controls[fieldName];
        if (field.invalid && (field.dirty || field.touched)) {
            const errors = field.errors;
            if (errors?.['required']) {
                return `${this.getFieldDisplayName(fieldName)} is required`;
            }
            if (errors?.['requiredTrue']) {
                return 'You must agree to the terms and conditions';
            }
            if (errors?.['email']) {
                return 'Please enter a valid email address';
            }
            if (errors?.['minlength']) {
                return `${this.getFieldDisplayName(fieldName)} must be at least ${errors['minlength'].requiredLength} characters long`;
            }
            if (errors?.['pattern']) {
                if (fieldName === 'phone') {
                    return 'Please enter a valid phone number';
                }
            }
        }

        // Check for password mismatch error at form level
        if (fieldName === 'confirmPassword' && this.registerForm.errors?.['passwordMismatch'] &&
            (field.dirty || field.touched)) {
            return 'Passwords do not match';
        }

        return '';
    }

    hasFieldError(fieldName: keyof typeof this.registerForm.controls): boolean {
        const field = this.registerForm.controls[fieldName];
        const hasFieldError = field.invalid && (field.dirty || field.touched);

        // Special case for confirm password - also check form-level password mismatch
        if (fieldName === 'confirmPassword') {
            return hasFieldError || (this.registerForm.errors?.['passwordMismatch'] && (field.dirty || field.touched));
        }

        return hasFieldError;
    }

    private getFieldDisplayName(fieldName: keyof typeof this.registerForm.controls): string {
        const displayNames: Record<keyof typeof this.registerForm.controls, string> = {
            name: 'Full name',
            email: 'Email',
            phone: 'Phone number',
            password: 'Password',
            confirmPassword: 'Confirm password',
            userType: 'User type',
            agreeTerms: 'Terms agreement'
        };
        return displayNames[fieldName];
    }

    onFieldInput(): void {
        // Clear general error message when user starts typing
        if (this.errorMessage()) {
            this.errorMessage.set('');
        }
    }

    onRegister(): void {
        // Mark all fields as touched to show validation errors
        this.registerForm.markAllAsTouched();

        // Check if form is valid using computed signal
        if (this.isFormInvalid()) {
            return;
        }

        this.isLoading.set(true);
        this.errorMessage.set('');

        // Get form values with proper typing
        const { name, email, phone, password, userType } = this.registerForm.getRawValue();

        const registerData = {
            name,
            email,
            phone,
            password,
            userType
        };

        this.#authService.register(registerData).subscribe({
            next: (res) => {
                this.isLoading.set(false);

                // Show success message
                this.#notificationService.showSuccess(
                    'Account created successfully! Please check your email for verification.',
                    'Registration Successful'
                );

                // Navigate to login page after successful registration
                setTimeout(() => {
                    this.#router.navigate(['/login']);
                }, 2000);
            },
            error: (err) => {
                this.isLoading.set(false);
                console.error('Registration error:', err);
                const errorMessage = err.error?.message || err.message || 'Registration failed. Please try again.';
                this.errorMessage.set(errorMessage);
                this.#notificationService.showError(errorMessage, 'Registration Failed');
            }
        });
    }
}
