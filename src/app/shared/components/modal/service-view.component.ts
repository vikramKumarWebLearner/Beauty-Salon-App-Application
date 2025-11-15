import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeFormatPipe } from '../../pipes/date-time-format.pipe';
import { LucideAngularModule } from 'lucide-angular';
import { DurationFormatPipe } from '../../pipes/duration-format-pipe';
@Component({
    selector: 'app-service-view',
    standalone: true,
    imports: [CommonModule, DateTimeFormatPipe, DurationFormatPipe, LucideAngularModule],
    template: `
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ service?.name || 'N/A' }}</h3>
      @if (service?.status) {
        <span [ngClass]="getStatusClass(service.status)"
              class="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800">
          {{ getStatusLabel(service.status) }}
        </span>
      }
    </div>
    <div class="shrink-0 bg-border h-[1px] w-full"></div>
    <!-- Service Details -->
    <div class="space-y-4">
      <!-- Service -->
      @if (service?.price) {
        <div class="flex items-center gap-3 text-sm">
             <lucide-icon class="h-4 w-4 text-muted-foreground" name="indian-rupee"></lucide-icon>
            <span class="text-muted-foreground">Price: </span>
            <span class="font-medium">{{ service.price }}</span>
        </div>
      }
     
      <!-- Date -->
      @if (service?.duration) {
        <div class="flex items-center gap-3 text-sm">
            <lucide-icon class="h-4 w-4 text-muted-foreground" name="timer"></lucide-icon>
            <span class="text-muted-foreground">Duration:</span>
            <span class="font-medium">
              {{ service.duration | durationFormat }}
            </span>
        </div>
      }

      <!-- Time -->
      @if (service?.createdAt) {
        <div class="flex items-center gap-3 text-sm">
        <lucide-icon class="h-4 w-4 text-muted-foreground" name="clock"></lucide-icon>
            <span class="text-muted-foreground">Created At:</span>
            <span class="font-medium">
              {{ service.createdAt  | dateTimeFormat }}
            </span>
        </div>
      }
    </div>
     
    <div class="shrink-0 bg-border h-[1px] w-full"></div>
    <!-- Notes -->
    <!-- @if (appointment?.notes) { -->
      <div class="flex items-center gap-2 text-sm text-muted-foreground">
        <div class="flex items-start gap-3">
          <lucide-icon class="h-4 w-4 text-muted-foreground" name="file-text"></lucide-icon>
          <div class="flex-1">
            <span class="text-muted-foreground">Notes</span>
            <p class="text-sm pl-6">{{ service?.description || '' }}</p>
          </div>
        </div>
      </div>
    <!-- } -->
  </div>
  `,
    styles: [`
    :host {
      display: block;
    }
  `]
})
export class ServiceViewComponent {
    @Input() service: any;

    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            'false': 'bg-yellow-100 text-yellow-800',
            'true': 'bg-green-100 text-green-800'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status: string): string {
        if (status) {
            return 'Active';
        } else {
            return 'InActive';
        }
    }
}
