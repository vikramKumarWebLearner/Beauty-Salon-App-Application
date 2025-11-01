import { Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    timestamp: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private readonly messagesSignal = signal<ToastMessage[]>([]);

    /** 👇 Get all active messages (used in ToastComponent) */
    activeMessages = this.messagesSignal.asReadonly();

    /** ✅ Show a new toast message */
    show(message: string, type: ToastType = 'info', duration = 4000) {
        const newToast: ToastMessage = {
            id: uuidv4(),
            message,
            type,
            duration,
            timestamp: Date.now()
        };

        this.messagesSignal.update(msgs => [...msgs, newToast]);

        if (duration > 0) {
            setTimeout(() => this.removeMessage(newToast.id), duration);
        }
    }

    /** 🔄 Remove toast */
    removeMessage(id: string) {
        this.messagesSignal.update(msgs => msgs.filter(m => m.id !== id));
    }

    /** 🧹 Clear all */
    clearAll() {
        this.messagesSignal.set([]);
    }
}
