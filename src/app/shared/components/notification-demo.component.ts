import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
    selector: 'app-notification-demo',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-4 text-gray-800">Notification Demo</h2>
      <div class="space-y-3">
        <button 
          (click)="showSuccess()" 
          class="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
          Show Success Message
        </button>
        
        <button 
          (click)="showError()" 
          class="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors">
          Show Error Message
        </button>
        
        <button 
          (click)="showInfo()" 
          class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Show Info Message
        </button>
        
        <button 
          (click)="showWarning()" 
          class="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors">
          Show Warning Message
        </button>
        
        <button 
          (click)="showLoginSuccess()" 
          class="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
          Show Login Success
        </button>
        
        <button 
          (click)="showSaveSuccess()" 
          class="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
          Show Save Success
        </button>
        
        <button 
          (click)="clearAll()" 
          class="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors">
          Clear All Messages
        </button>
      </div>
    </div>
  `
})
export class NotificationDemoComponent {
    private readonly notificationService = inject(NotificationService);

    showSuccess(): void {
        this.notificationService.showSuccess('This is a success message!', 'Success');
    }

    showError(): void {
        this.notificationService.showError('This is an error message!', 'Error');
    }

    showInfo(): void {
        this.notificationService.showInfo('This is an info message!', 'Information');
    }

    showWarning(): void {
        this.notificationService.showWarning('This is a warning message!', 'Warning');
    }

    showLoginSuccess(): void {
        this.notificationService.showLoginSuccess('admin');
    }

    showSaveSuccess(): void {
        this.notificationService.showSaveSuccess('User Profile');
    }

    clearAll(): void {
        this.notificationService.clear();
    }
}
