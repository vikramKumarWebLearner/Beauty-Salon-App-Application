import { Injectable, inject } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../../services/notification.service';

type UserRole = 'admin' | 'staff' | 'customer';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    private authService = inject(AuthService);
    private router = inject(Router);
    private notificationService = inject(NotificationService);

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        // First check if user is authenticated
        if (!this.authService.isAuthenticated()) {
            this.router.navigate(['/login']);
            return false;
        }

        // Get required roles from route data
        const requiredRoles = route.data?.['roles'] as UserRole[];

        if (!requiredRoles || requiredRoles.length === 0) {
            // No specific roles required, just need to be authenticated
            return true;
        }

        // Read role from storage (set during login or decoded from token in real app)
        const userRole = (this.authService.getUserRole() || 'customer') as UserRole;

        if (requiredRoles.includes(userRole)) {
            return true;
        }

        // User doesn't have required role
        this.notificationService.showError(
            'You do not have permission to access this page',
            'Access Denied'
        );

        // Redirect to appropriate dashboard based on user role
        this.redirectToDashboard(userRole);
        return false;
    }

    private redirectToDashboard(role: UserRole): void {
        const dashboardRoutes: Record<UserRole, string> = {
            admin: '/admin/dashboard',
            staff: '/staff/dashboard',
            customer: '/customer/dashboard'
        };

        this.router.navigate([dashboardRoutes[role]]);
    }
}
