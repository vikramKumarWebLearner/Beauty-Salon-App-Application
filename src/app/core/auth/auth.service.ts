import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';
import { NotificationService } from '../services/notification.service';
import { TokenStorageService } from './token-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);
    private notificationService = inject(NotificationService);
    private tokenStorage = inject(TokenStorageService);

    private get apiUrl(): string {
        return `${this.configService.apiUrl}/auth`;
    }

    login(credentials: { email: string; password: string }): Observable<any> {
        // For development/testing purposes, simulate API call
        if (!this.configService.isProduction) {
            return new Observable(observer => {
                setTimeout(() => {
                    // Mock successful login response
                    if (credentials.email && credentials.password) {
                        observer.next({
                            token: 'mock-jwt-token-' + Date.now(),
                            user: {
                                email: credentials.email,
                                name: 'Test User'
                            }
                        });
                        observer.complete();
                    } else {
                        observer.error({
                            error: { message: 'Invalid credentials' }
                        });
                    }
                }, 1000); // Simulate network delay
            });
        }

        // Production API call
        return this.http.post(`${this.apiUrl}/login`, credentials);
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
        this.tokenStorage.clearTokens();
        this.notificationService.showLogoutSuccess();
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
}
