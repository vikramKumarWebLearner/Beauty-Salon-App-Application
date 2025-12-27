export const getDeviceInfo = () => {
    return {
        deviceId: navigator.userAgent,          // unique enough for web
        deviceType: 'web',
        brand: navigator.vendor || 'unknown',
        model: navigator.platform || 'unknown',
        osVersion: navigator.userAgent,
        appVersion: (window as any)?.APP_VERSION || '1.0.0',
        language: navigator.language
    };
};


export class ScreenHelper {

    static getWidth(): number {
        return window.innerWidth;
    }

    static isMobile(): boolean {
        return window.innerWidth <= 768;
    }

    static isTablet(): boolean {
        return window.innerWidth > 768 && window.innerWidth <= 1024;
    }

    static isDesktop(): boolean {
        return window.innerWidth > 1024;
    }

}

