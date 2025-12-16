import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from './config.service';
import { TokenStorageService } from '../auth/token-storage.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// ✅ Define standard API response type
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
}

@Injectable({ providedIn: 'root' })
export class SettingService {
    private http = inject(HttpClient);
    private configService = inject(ConfigService);
    private tokenStorage = inject(TokenStorageService);

    private get apiUrl(): string {
        return `${this.configService.apiUrl}`;
    }


    private get headers(): HttpHeaders {
        const token = this.tokenStorage.getToken();
        return new HttpHeaders({
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
        });
    }

    getProfile(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/users/profile`, {
            headers: this.headers,
        });
    }

    updateProfile(id: string, profile: any): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}/users/${id}/profile`, profile, {
            headers: this.headers,
        });
    }


    // settings
    getNotificationSettings(): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${this.apiUrl}/users/settings/notification`, {
            headers: this.headers,
        });
    }

    updateSettings(settings: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}/users/settings/update/notification`, settings, {
            headers: this.headers,
        });

    }
}