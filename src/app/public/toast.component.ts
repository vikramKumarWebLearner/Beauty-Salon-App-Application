import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../app/public/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="fixed top-4 right-4 z-[9999] space-y-3 pointer-events-none">
    @for (message of messages(); track message.id) {
      <div
        class="flex items-center gap-3 px-4 py-3 rounded-lg shadow-md border-l-4 transition-all duration-300 ease-in-out animate-slide-in-right"
        [ngClass]="{
          'border-green-500 bg-green-50 text-green-700': message.type === 'success',
          'border-red-500 bg-red-50 text-red-700': message.type === 'error',
          'border-yellow-500 bg-yellow-50 text-yellow-700': message.type === 'warning',
          'border-blue-500 bg-blue-50 text-blue-700': message.type === 'info'
        }"
        [attr.data-toast-id]="message.id"
      >
        <!-- Icon -->
        <div class="flex-shrink-0">
          @switch (message.type) {
            @case ('success') {
              <svg class="leafygreen-ui-1qf4ete" height="16" width="16" role="img" aria-label="Checkmark With Circle Icon" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15ZM10.4485 4.89583C10.8275 4.45816 11.4983 4.43411 11.9077 4.84352C12.2777 5.21345 12.2989 5.80633 11.9564 6.2018L7.38365 11.4818C7.31367 11.5739 7.22644 11.6552 7.12309 11.7208C6.65669 12.0166 6.03882 11.8783 5.74302 11.4119L3.9245 8.54448C3.6287 8.07809 3.767 7.46021 4.2334 7.16442C4.69979 6.86863 5.31767 7.00693 5.61346 7.47332L6.71374 9.20819L10.4485 4.89583Z" fill="currentColor"></path></svg>
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

        <!-- Close -->
        <!-- <button (click)="removeMessage(message.id)" class="p-1 rounded-md hover:bg-white/30">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd" />
          </svg>
        </button> -->
      </div>
    }
  </div>
  `
})
export class ToastComponent {
  private readonly notificationService = inject(NotificationService);
  readonly messages = computed(() => this.notificationService.activeMessages());

  removeMessage(id: string) {
    const el = document.querySelector(`[data-toast-id="${id}"]`);
    if (el) {
      el.classList.remove('animate-slide-in-right');
      el.classList.add('animate-slide-out-right');
      setTimeout(() => this.notificationService.removeMessage(id), 300);
    } else {
      this.notificationService.removeMessage(id);
    }
  }
}
