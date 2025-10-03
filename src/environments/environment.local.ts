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
        roleKey: string;
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
    production: false,
    apiUrl: 'http://localhost:8080/api/v1',
    appName: 'Bella Beauty Salon Management',
    version: '1.0.0',
    apiTimeout: 10000,
    enableLogging: true,
    features: {
        enableRegistration: true,
        enablePasswordReset: true,
        enableEmailNotifications: false,
        enableSmsNotifications: false,
    },
    auth: {
        tokenKey: 'bella_beauty_token',
        refreshTokenKey: 'bella_beauty_refresh_token',
        roleKey: 'bella_beauty_role',
        tokenExpirationTime: 3600000, // 1 hour
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
