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
export class AppointmentService {
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

    // ✅ GET Appointments  Details
    getAppointments(): Observable<any> {
        return this.http.get(this.apiUrl + '/bookings', {
            headers: this.headers,
            observe: 'response' // This will give us access to the full response
        }).pipe(
            // Transform the response to match expected format
            map((response: any) => {
                // If the response body is already in the expected format, return it
                if (response.body && typeof response.body === 'object') {
                    return response.body;
                }

                // If the response is an array or primitive, wrap it
                return {
                    success: true,
                    status: 200,
                    data: response.body || response,
                    message: 'Data retrieved successfully'
                };
            }),
            catchError((error) => {
                // Return a structured error response
                return throwError(() => ({
                    success: false,
                    message: error.message || 'Failed to fetch dashboard data',
                    error: error
                }));
            })
        );
    }

    //  GET STAFFS
    getStaffs(): Observable<any> {
        return this.http.get(this.apiUrl + '/staff', {
            headers: this.headers,
            observe: 'response' // This will give us access to the full response
        }).pipe(
            // Transform the response to match expected format
            map((response: any) => {
                // If the response body is already in the expected format, return it
                if (response.body && typeof response.body === 'object') {
                    return response.body;
                }

                // If the response is an array or primitive, wrap it
                return {
                    success: true,
                    status: 200,
                    data: response.body || response,
                    message: 'Data retrieved successfully'
                };
            }),
            catchError((error) => {
                // Return a structured error response
                return throwError(() => ({
                    success: false,
                    message: error.message || 'Failed to fetch dashboard data',
                    error: error
                }));
            })
        );
    }

    // GET USERS
    getUsers(): Observable<any> {
        return this.http.get(this.apiUrl + '/users', {
            headers: this.headers,
            observe: 'response' // This will give us access to the full response
        }).pipe(
            // Transform the response to match expected format
            map((response: any) => {
                // If the response body is already in the expected format, return it
                if (response.body && typeof response.body === 'object') {
                    return response.body;
                }

                // If the response is an array or primitive, wrap it
                return {
                    success: true,
                    status: 200,
                    data: response.body || response,
                    message: 'Data retrieved successfully'
                };

            }),
            catchError((error) => {
                // Return a structured error response
                return throwError(() => ({
                    success: false,
                    message: error.message || 'Failed to fetch dashboard data',
                    error: error
                }));
            })
        );
    }


    // GET SERVICE
    getServices(): Observable<any> {
        return this.http.get(this.apiUrl + '/services', {
            headers: this.headers,
            observe: 'response' // This will give us access to the full response
        }).pipe(
            // Transform the response to match expected format
            map((response: any) => {
                // If the response body is already in the expected format, return it
                if (response.body && typeof response.body === 'object') {
                    return response.body;
                }

                // If the response is an array or primitive, wrap it
                return {
                    success: true,
                    status: 200,
                    data: response.body || response,
                    message: 'Data retrieved successfully'
                };
            }),
            catchError((error) => {
                // Return a structured error response
                return throwError(() => ({
                    success: false,
                    message: error.message || 'Failed to fetch dashboard data',
                    error: error
                }));
            })
        );
    }

    createService(data: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${this.apiUrl}/bookings/create`, data, {
            headers: this.headers,
        });
    }

    updateAppointment(id: string, data: any) {
        return this.http.put(`/api/bookings/${id}`, data, {
            headers: this.headers,
        });
    }

    deleteAppointment(id: string) {
        return this.http.delete(`/api/bookings/${id}`, {
            headers: this.headers,
        });
    }

}