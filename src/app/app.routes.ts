import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AdminDashboard } from './layouts/admin-layout/admin-dashboard/admin-dashboard';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { Home } from './layouts/public-layout/home/home';
import { ToastComponent } from './public/toast.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password';
import { ResetPassword } from './auth/reset-password/reset-password';
export const routes: Routes = [
    // 🌐 Public Routes
    { path: '', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'reset-password', component: ResetPassword },

    // 🔒 Admin Routes (Protected by Auth + Role Guards)
    {
        path: 'admin',
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['admin'] },
        children: [
            {
                path: '',
                component: AdminDashboard,
                children: [
                    {
                        path: 'dashboard',
                        loadComponent: () =>
                            import('./layouts/admin-layout/dashboard/dashboard').then(
                                (m) => m.Dashboard
                            ),
                    },
                    {
                        path: 'appointments',
                        loadComponent: () =>
                            import('./layouts/admin-layout/appointments/appointments').then(
                                (m) => m.Appointments
                            ),
                    },
                    {
                        path: 'shifts',
                        loadComponent: () =>
                            import('./layouts/admin-layout/shifts/shifts').then(
                                (m) => m.Shifts
                            ),
                    },
                    // Add more admin child routes here if needed:
                    {
                        path: 'staff-management',
                        loadComponent: () => import('./layouts/admin-layout/staff/staff').then(m => m.Staff),
                    },
                    {
                        path: 'services',
                        loadComponent: () => import('./layouts/admin-layout/service/service').then(m => m.Service),
                    },
                    {
                        path: 'analytics',
                        loadComponent: () => import('./layouts/admin-layout/analytics/analytics').then(m => m.Analytics),
                    },
                    {
                        path: 'inventory',
                        loadComponent: () => import('./layouts/admin-layout/inventory/inventory').then(m => m.Inventory),
                    },
                    {
                        path: 'settings',
                        loadComponent: () => import('./layouts/admin-layout/setting/setting').then(m => m.Setting),
                    },
                ],
            },
        ],
    },

    // 🧪 Demo & Testing Routes
    // { path: 'demo/notifications', component: NotificationDemoComponent },
    // { path: 'test/notifications', component: NotificationTestComponent },
    { path: 'toastMessage', component: ToastComponent },
    // 🚨 Fallback Route
    { path: '**', redirectTo: 'login' },
];
