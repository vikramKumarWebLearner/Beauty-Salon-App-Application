import { Component } from '@angular/core';
import { NotificationDemoComponent } from '../shared/components/notification-demo.component';

@Component({
    selector: 'app-notification-test',
    standalone: true,
    imports: [NotificationDemoComponent],
    template: `
    <div class="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Notification System Test</h1>
          <p class="mt-2 text-gray-600">Test the custom toast notification system</p>
        </div>
        <app-notification-demo />
      </div>
    </div>
  `
})
export class NotificationTestComponent { }
