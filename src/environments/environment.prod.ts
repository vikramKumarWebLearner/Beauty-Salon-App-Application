// import type { Environment } from './environment';

interface Environment {
    production: boolean;
    apiUrl: string;
    appName: string;
    version: string;
    apiTimeout: number;
    enableLogging: boolean;
    features: {
        enableRegistration: boolean;
        enablePasswordReset: boolean;
        enableEmailNotifications: boolean;
        enableSmsNotifications: boolean;
    };
    auth: {
        tokenKey: string;
        refreshTokenKey: string;
        tokenExpirationTime: number;
    };
    salon: {
        businessName: string;
        businessEmail: string;
        businessPhone: string;
        address: string;
        workingHours: {
            start: string;
            end: string;
        };
    };
}

export const environment: Environment = {
    production: true,
    apiUrl: 'https://api.bellabeauty.com/api',
    appName: 'Bella Beauty Salon Management',
    version: '1.0.0',
    apiTimeout: 8000, // Shorter timeout for production
    enableLogging: false, // Disabled in production for performance
    features: {
        enableRegistration: true,
        enablePasswordReset: true,
        enableEmailNotifications: true,  // Enabled in production
        enableSmsNotifications: true,    // Enabled in production
    },
    auth: {
        tokenKey: 'bella_beauty_token',
        refreshTokenKey: 'bella_beauty_refresh_token',
        tokenExpirationTime: 3600000, // 1 hour in production
    },
    salon: {
        businessName: 'Bella Beauty',
        businessEmail: 'info@bellabeauty.com',
        businessPhone: '+1 (555) 123-4567',
        address: '123 Beauty Street, City, State 12345',
        workingHours: {
            start: '09:00',
            end: '18:00',
        },
    },
};
