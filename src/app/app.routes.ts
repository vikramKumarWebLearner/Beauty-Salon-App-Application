import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AdminDashboard } from './layouts/admin-layout/admin-dashboard/admin-dashboard';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { Home } from './layouts/public-layout/home/home';
import { ToastComponent } from './public/toast.component';
export const routes: Routes = [
    // 🌐 Public Routes
    { path: '', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },

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
                    // Add more admin child routes here if needed:
                    // {
                    //   path: 'staff',
                    //   loadComponent: () => import('./layouts/admin-layout/staff/staff').then(m => m.Staff),
                    // },
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
