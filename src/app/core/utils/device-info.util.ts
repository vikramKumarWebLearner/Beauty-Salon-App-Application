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
