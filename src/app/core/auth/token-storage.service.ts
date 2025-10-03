import { Injectable, inject } from '@angular/core';
import { ConfigService } from '../services/config.service';

@Injectable({
    providedIn: 'root'
})
export class TokenStorageService {
    private configService = inject(ConfigService);

    private get tokenKey(): string {
        return this.configService.authConfig.tokenKey;
    }

    private get refreshTokenKey(): string {
        return this.configService.authConfig.refreshTokenKey;
    }

    private get roleKey(): string {
        return this.configService.authConfig.roleKey;
    }

    /**
     * Save authentication token to localStorage
     */
    saveToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Get authentication token from localStorage
     */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Save refresh token to localStorage
     */
    saveRefreshToken(refreshToken: string): void {
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    /**
     * Get refresh token from localStorage
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }

    /**
     * Remove all tokens from localStorage
     */
    clearTokens(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
        localStorage.removeItem(this.roleKey);
    }

    /**
     * Check if user has a valid token
     */
    hasToken(): boolean {
        return !!this.getToken();
    }

    /**
     * Check if user has a valid refresh token
     */
    hasRefreshToken(): boolean {
        return !!this.getRefreshToken();
    }

    /**
     * Save and get user role
     */
    saveUserRole(role: string): void {
        localStorage.setItem(this.roleKey, role);
    }

    getUserRole(): string | null {
        return localStorage.getItem(this.roleKey);
    }
}
