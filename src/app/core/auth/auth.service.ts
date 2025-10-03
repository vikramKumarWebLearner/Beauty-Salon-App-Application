import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);
    private notificationService = inject(NotificationService);
    private tokenStorage = inject(TokenStorageService);
    private router = inject(Router);

    private get apiUrl(): string {
        return `${this.configService.apiUrl}/auth`;
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
            tap((response: any) => {
                console.log('Auth service processing login response:', response);

                // Handle different response structures
                const token = response.data?.token ?? response.token ?? response.access_token;
                const role = response.data?.role ?? response.role ?? response.user?.role;
                const user = response.data?.user ?? response.user;

                // Save token if present
                if (token) {
                    this.tokenStorage.saveToken(token);
                    console.log('Token saved successfully');
                } else {
                    console.warn('No token found in login response');
                }

                // Save role if present
                if (role) {
                    this.tokenStorage.saveUserRole(role);
                    console.log('Role saved successfully:', role);
                } else {
                    console.warn('No role found in login response');
                }

                // Save additional user data if needed
                if (user && user.id) {
                    localStorage.setItem('bella_beauty_user_id', user.id.toString());
                }
            })
        );
    }


    register(userData: {
        name: string;
        email: string;
        phone: string;
        password: string;
        userType: string
    }): Observable<any> {
        // For development/testing purposes, simulate API call
        if (!this.configService.isProduction) {
            return new Observable(observer => {
                setTimeout(() => {
                    // Mock successful registration response
                    if (userData.email && userData.password && userData.name) {
                        // Simulate email already exists error occasionally for testing
                        if (userData.email === 'test@existing.com') {
                            observer.error({
                                error: { message: 'Email already exists' }
                            });
                            return;
                        }

                        observer.next({
                            message: 'Registration successful',
                            user: {
                                id: Date.now(),
                                email: userData.email,
                                name: userData.name,
                                phone: userData.phone,
                                userType: userData.userType
                            }
                        });
                        observer.complete();
                    } else {
                        observer.error({
                            error: { message: 'All fields are required' }
                        });
                    }
                }, 1500); // Simulate network delay
            });
        }

        // Production API call
        return this.http.post(`${this.apiUrl}/register`, userData);
    }

    logout() {
        // Clear all tokens and user data
        this.tokenStorage.clearTokens();

        // Clear any additional user data
        localStorage.removeItem('bella_beauty_user_id');

        // Show logout success message
        this.notificationService.showLogoutSuccess();

        // Navigate to logout page (which will handle the redirect to login)
        this.router.navigate(['/logout']);
    }

    /**
     * Logout without navigation (useful for programmatic logout)
     */
    logoutSilent() {
        this.tokenStorage.clearTokens();
        localStorage.removeItem('bella_beauty_user_id');
    }

    saveToken(token: string) {
        this.tokenStorage.saveToken(token);
    }

    getToken(): string | null {
        return this.tokenStorage.getToken();
    }

    isAuthenticated(): boolean {
        return this.tokenStorage.hasToken();
    }

    saveUserRole(role: string) {
        this.tokenStorage.saveUserRole(role);
    }

    getUserRole(): string | null {
        return this.tokenStorage.getUserRole();
    }

    /**
     * Set user role manually (useful when API doesn't return role)
     */
    setUserRole(role: string): void {
        this.tokenStorage.saveUserRole(role);
    }

    /**
     * Check if user has a specific role
     */
    hasRole(role: string): boolean {
        const userRole = this.getUserRole();
        return userRole === role;
    }

    /**
     * Check if user is admin
     */
    isAdmin(): boolean {
        return this.hasRole('admin');
    }

    /**
     * Check if user is staff
     */
    isStaff(): boolean {
        return this.hasRole('staff');
    }

    /**
     * Check if user is customer
     */
    isCustomer(): boolean {
        return this.hasRole('customer');
    }
}
