import { Component, inject, computed, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, ToastMessage } from '../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] space-y-2 pointer-events-none">
      @for (message of messages(); track message.id) {
        <div 
          class="max-w-sm w-full bg-white shadow-xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transform transition-all duration-300 ease-in-out border-l-4 animate-slide-in-right"
          [ngClass]="getToastClasses(message.type)"
          role="alert"
          [attr.data-toast-id]="message.id">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="w-5 h-5 flex items-center justify-center">
                  @switch (message.type) {
                    @case ('success') {
                      <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                      </svg>
                    }
                    @case ('error') {
                      <svg class="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                      </svg>
                    }
                    @case ('warning') {
                      <svg class="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                      </svg>
                    }
                    @case ('info') {
                      <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                      </svg>
                    }
                  }
                </div>
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p class="text-sm font-semibold text-gray-900">{{ message.title }}</p>
                <p class="mt-1 text-sm text-gray-600">{{ message.message }}</p>
              </div>
              <div class="ml-4 flex-shrink-0 flex">
                <button 
                  (click)="removeMessage(message.id)"
                  class="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors">
                  <span class="sr-only">Close</span>
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <!-- Progress bar -->
          @if (message.duration && message.duration > 0) {
            <div class="h-1 bg-gray-200">
              <div 
                class="h-full transition-all ease-linear"
                [ngClass]="getProgressBarColor(message.type)"
                [style.width.%]="getProgressWidth(message)"
                [style.transition-duration.ms]="message.duration">
              </div>
            </div>
          }
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
