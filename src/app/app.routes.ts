import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { LogoutComponent } from './auth/logout/logout.component';
import { AdminDashboard } from './layouts/admin-layout/admin-dashboard/admin-dashboard';
import { NotificationDemoComponent } from './shared/components/notification-demo.component';
import { NotificationTestComponent } from './public/notification-test.component';
import { AuthGuard } from './core/auth/guards/auth.guard';
import { RoleGuard } from './core/auth/guards/role.guard';
import { Home } from './layouts/public-layout/home/home';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
    { path: 'admin/dashboard', component: AdminDashboard, canActivate: [AuthGuard, RoleGuard], data: { roles: ['admin'] } },
    { path: 'demo/notifications', component: NotificationDemoComponent },
    { path: 'test/notifications', component: NotificationTestComponent },
    // { path: 'admin/appointments', component: AppointmentsComponent },
    // { path: 'admin/staff-management', component: StaffManagementComponent },
    // { path: 'admin/services', component: ServicesComponent },
    // { path: 'admin/analytics', component: AnalyticsComponent },
    // { path: 'admin/inventory', component: InventoryComponent },
    // { path: 'admin/payments', component: PaymentsComponent },
    // { path: 'admin/settings', component: SettingsComponent },
    { path: '**', redirectTo: 'login' }
];
