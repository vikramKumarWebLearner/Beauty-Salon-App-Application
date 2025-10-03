import { Injectable, signal, computed } from '@angular/core';

export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    timestamp: number;
    duration?: number;
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly messages = signal<ToastMessage[]>([]);

    readonly activeMessages = computed(() => this.messages());

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private addMessage(type: ToastMessage['type'], message: string, title: string, duration = 3000): void {
        const toast: ToastMessage = {
            id: this.generateId(),
            type,
            title,
            message,
            timestamp: Date.now(),
            duration
        };

        this.messages.update(messages => [...messages, toast]);

        // Auto remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeMessage(toast.id);
            }, duration);
        }
    }

    removeMessage(id: string): void {
        this.messages.update(messages => messages.filter(m => m.id !== id));
    }

    /**
     * Show success message
     */
    showSuccess(message: string, title?: string): void {
        this.addMessage('success', message, title || 'Success');
        console.log(`✅ ${title || 'Success'}: ${message}`);
    }

    /**
     * Show error message
     */
    showError(message: string, title?: string): void {
        this.addMessage('error', message, title || 'Error');
        console.error(`❌ ${title || 'Error'}: ${message}`);
    }

    /**
     * Show info message
     */
    showInfo(message: string, title?: string): void {
        this.addMessage('info', message, title || 'Info');
        console.info(`ℹ️ ${title || 'Info'}: ${message}`);
    }

    /**
     * Show warning message
     */
    showWarning(message: string, title?: string): void {
        this.addMessage('warning', message, title || 'Warning');
        console.warn(`⚠️ ${title || 'Warning'}: ${message}`);
    }

    /**
     * Clear all toasts
     */
    clear(): void {
        this.messages.set([]);
    }

    /**
     * Show login success message
     */
    showLoginSuccess(userType: string): void {
        this.showSuccess(`Welcome back! Redirecting to ${userType} dashboard...`, 'Login Successful');
    }

    /**
     * Show logout success message
     */
    showLogoutSuccess(): void {
        this.showSuccess('You have been logged out successfully', 'Logout Successful');
    }

    /**
     * Show registration success message
     */
    showRegistrationSuccess(): void {
        this.showSuccess('Your account has been created successfully', 'Registration Successful');
    }

    /**
     * Show profile update success message
     */
    showProfileUpdateSuccess(): void {
        this.showSuccess('Your profile has been updated successfully', 'Profile Updated');
    }

    /**
     * Show appointment booking success message
     */
    showAppointmentBookingSuccess(): void {
        this.showSuccess('Your appointment has been booked successfully', 'Appointment Booked');
    }

    /**
     * Show appointment cancellation success message
     */
    showAppointmentCancellationSuccess(): void {
        this.showSuccess('Your appointment has been cancelled successfully', 'Appointment Cancelled');
    }

    /**
     * Show password change success message
     */
    showPasswordChangeSuccess(): void {
        this.showSuccess('Your password has been changed successfully', 'Password Updated');
    }

    /**
     * Show data save success message
     */
    showSaveSuccess(itemName?: string): void {
        const message = itemName ? `${itemName} saved successfully` : 'Data saved successfully';
        this.showSuccess(message, 'Saved');
    }

    /**
     * Show data delete success message
     */
    showDeleteSuccess(itemName?: string): void {
        const message = itemName ? `${itemName} deleted successfully` : 'Data deleted successfully';
        this.showSuccess(message, 'Deleted');
    }

    /**
     * Show data update success message
     */
    showUpdateSuccess(itemName?: string): void {
        const message = itemName ? `${itemName} updated successfully` : 'Data updated successfully';
        this.showSuccess(message, 'Updated');
    }
}
