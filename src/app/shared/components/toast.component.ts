import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
        @for (message of messages(); track message.id) {
          <div
            class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border-l-4 transition-all duration-300 ease-in-out bg-green-50 animate-slide-in-right"
            [ngClass]="{
              'border-green-500 bg-green-50 text-green-700': message.type === 'success',
              'border-red-500 bg-red-50 text-red-700': message.type === 'error',
              'border-yellow-500 bg-yellow-50 text-yellow-700': message.type === 'warning',
              'border-blue-500 bg-blue-50 text-blue-700': message.type === 'info'
            }"
            role="alert"
            [attr.data-toast-id]="message.id"
          >
            <!-- Icon -->
            <div class="flex-shrink-0">
              @switch (message.type) {
                @case ('success') {
                  <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                }
                @case ('error') {
                  <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd" />
                  </svg>
                }
                @case ('warning') {
                  <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd" />
                  </svg>
                }
                @case ('info') {
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd" />
                  </svg>
                }
              }
            </div>

            <!-- Text -->
            <div class="flex-1">
              <p class="text-sm font-medium">{{ message.message }}</p>
            </div>

            <!-- Close Button -->
            <button
              (click)="removeMessage(message.id)"
              class="p-1 rounded-md hover:bg-white/30 focus:outline-none transition"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        }
      </div>
  `
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);

  readonly messages = computed(() => this.notificationService.activeMessages());

  getToastClasses(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'border-green-500';
      case 'error':
        return 'border-red-500';
      case 'warning':
        return 'border-yellow-500';
      case 'info':
        return 'border-blue-500';
      default:
        return 'border-gray-500';
    }
  }

  getProgressBarColor(type: ToastMessage['type']): string {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  }

  getProgressWidth(message: ToastMessage): number {
    if (!message.duration) return 0;

    const elapsed = Date.now() - message.timestamp;
    const remaining = Math.max(0, message.duration - elapsed);
    return (remaining / message.duration) * 100;
  }

  removeMessage(id: string): void {
    // Add slide-out animation before removing
    const toastElement = document.querySelector(`[data-toast-id="${id}"]`);
    if (toastElement) {
      toastElement.classList.remove('animate-slide-in-right');
      toastElement.classList.add('animate-slide-out-right');

      setTimeout(() => {
        this.notificationService.removeMessage(id);
      }, 300); // Match animation duration
    } else {
      this.notificationService.removeMessage(id);
    }
  }
}
