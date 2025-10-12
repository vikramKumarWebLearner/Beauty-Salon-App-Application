import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config = environment;

    constructor() {
        // console.log('App running in', this.config.production ? 'production' : 'development', 'mode');
        // console.log('API URL:', this.config.apiUrl);
    }

    get apiUrl(): string {
        return this.config.apiUrl;
    }

    get appName(): string {
        return this.config.appName;
    }

    get version(): string {
        return this.config.version;
    }

    get isProduction(): boolean {
        return this.config.production;
    }

    get isLoggingEnabled(): boolean {
        return this.config.enableLogging;
    }

    get features() {
        return this.config.features;
    }

    get authConfig() {
        return this.config.auth;
    }

    get salonConfig() {
        return this.config.salon;
    }

    get apiTimeout(): number {
        return this.config.apiTimeout;
    }

    // Helper method to log only in development
    log(message: any, ...optionalParams: any[]): void {
        if (this.isLoggingEnabled) {
            console.log(`[${this.appName}]`, message, ...optionalParams);
        }
    }

    // Helper method to log errors
    logError(message: any, ...optionalParams: any[]): void {
        if (this.isLoggingEnabled) {
            console.error(`[${this.appName}]`, message, ...optionalParams);
        }
    }

    get tokenKeyName() {
        return this.config.auth.tokenKey;
    }

    get roleKeyName() {
        return this.config.auth.roleKey;
    }
}
