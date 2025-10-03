import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-logout',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="max-w-md w-full space-y-8">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
                    <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
                        Logging out...
                    </h2>
                    <p class="mt-2 text-sm text-gray-600">
                        Please wait while we securely log you out.
                    </p>
                </div>
            </div>
        </div>
    `
})
export class LogoutComponent implements OnInit {
    private readonly authService = inject(AuthService);
    private readonly router = inject(Router);
    private readonly notificationService = inject(NotificationService);

    ngOnInit(): void {
        this.performLogout();
    }

    private performLogout(): void {
        // Clear tokens and user data
        this.authService.logout();

        // Show logout success message
        this.notificationService.showLogoutSuccess();

        // Navigate to login page after a short delay
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 1500);
    }
}
