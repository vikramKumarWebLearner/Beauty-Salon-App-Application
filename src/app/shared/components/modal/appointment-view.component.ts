import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateTimeFormatPipe } from '../../pipes/date-time-format.pipe';
import { TimeFormatPipe } from '../../pipes/timeFormat.pipe';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-appointment-view',
    standalone: true,
    imports: [CommonModule, DateTimeFormatPipe, TimeFormatPipe, LucideAngularModule],
    template: `
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">{{ appointment?.customerName || 'N/A' }}</h3>
      @if (appointment?.status) {
        <span [ngClass]="getStatusClass(appointment.status)"
              class="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent hover:bg-primary/80 bg-green-100 text-green-800">
          {{ getStatusLabel(appointment.status) }}
        </span>
      }
    </div>
    <div class="shrink-0 bg-border h-[1px] w-full"></div>
    <!-- Appointment Details -->
    <div class="space-y-4">
      <!-- Service -->
      @if (appointment?.service) {
        <div class="flex items-center gap-3 text-sm">
             <lucide-icon class="h-4 w-4 text-muted-foreground" name="briefcase"></lucide-icon>
            <span class="text-muted-foreground">Service: </span>
            <span class="font-medium">{{ appointment.service }}</span>
        </div>
      }
     
      <!-- Date -->
      @if (appointment?.appointmentDate) {
        <div class="flex items-center gap-3 text-sm">
            <lucide-icon class="h-4 w-4 text-muted-foreground" name="calendar"></lucide-icon>
            <span class="text-muted-foreground">Date:</span>
            <span class="font-medium">
              {{ appointment.appointmentDate | dateTimeFormat }}
            </span>
        </div>
      }

      <!-- Time -->
      @if (appointment?.appointmentTime) {
        <div class="flex items-center gap-3 text-sm">
        <lucide-icon class="h-4 w-4 text-muted-foreground" name="clock"></lucide-icon>
            <span class="text-muted-foreground">Time:</span>
            <span class="font-medium">
              {{ appointment.appointmentTime | timeFormat }}
            </span>
        </div>
      }

      <!-- Staff -->
      @if (appointment?.staff) {
        <div class="flex items-center gap-3 text-sm">
            <lucide-icon class="h-4 w-4 text-muted-foreground" name="user"></lucide-icon>
            <span class="text-muted-foreground">Staff:</span>
            <span class="font-medium">{{ appointment.staff }}</span>
        </div>
      }

      <!-- Phone -->
      @if (appointment?.phone) {
        <div class="flex items-center gap-3 text-sm">
        <lucide-icon class="h-4 w-4 text-muted-foreground" name="phone"></lucide-icon>
            <span class="text-muted-foreground">Phone:</span>
            <span class="font-medium">{{ appointment.phone }}</span>
        </div>
      }

      <!-- Email -->
      @if (appointment?.email) {
        <div class="flex items-center gap-3 text-sm">
        <lucide-icon class="h-4 w-4 text-muted-foreground" name="mail"></lucide-icon>
            <span class="text-muted-foreground">Email</span>
            <span class="font-medium">{{ appointment.email }}</span>
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
            <p class="text-sm pl-6">{{ appointment?.notes || '' }}</p>
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
export class AppointmentViewComponent {
    @Input() appointment: any;

    getStatusClass(status: string): string {
        const statusClasses: { [key: string]: string } = {
            'pending': 'bg-yellow-100 text-yellow-800',
            'confirmed': 'bg-green-100 text-green-800',
            'completed': 'bg-blue-100 text-blue-800',
            'cancelled': 'bg-red-100 text-red-800'
        };
        return statusClasses[status.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }

    getStatusLabel(status: string): string {
        return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    }
}
