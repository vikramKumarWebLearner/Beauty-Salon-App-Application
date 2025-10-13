import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../services/notification.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        }

        // Show notification that user needs to login
        this.notificationService.showError(
            'Please log in to access this page',
            'Authentication Required'
        );

        // Redirect to login page with return URL
        this.router.navigate(['/login']);

        return false;
    }
}
