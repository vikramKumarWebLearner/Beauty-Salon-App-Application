import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ConfirmationModalConfig {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
  cancelButtonClass?: string;
  type?: 'delete' | 'warning' | 'info';
}

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-backdrop" 
           (click)="onBackdropClick($event)">
        <div class="bg-pink-50 rounded-lg shadow-xl w-full mx-4 max-w-md modal-content modal-enter">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between pt-6 pl-6 pr-6 pb-4">
            <h2 class="text-lg font-semibold leading-none tracking-tight text-gray-900">{{ config.title }}</h2>
          </div>

          <!-- Modal Body -->
          <div class="px-6 pb-4">
            <p class="text-sm text-gray-700 leading-relaxed">{{ config.message }}</p>
          </div>

          <!-- Modal Footer -->
          <div class="flex justify-end gap-3 px-6 pb-6">
            <button 
              type="button" 
              (click)="onCancel()"
              [class]="config.cancelButtonClass || 'px-4 py-2 text-sm font-medium text-gray-900 bg-white border-2 border-pink-500 rounded-md hover:bg-pink-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors'">
              {{ config.cancelText || 'Cancel' }}
            </button>
            <button 
              type="button"
              (click)="onConfirm()"
              [class]="config.confirmButtonClass || 'px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors'">
              {{ config.confirmText || 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      backdrop-filter: blur(2px);
    }
    
    .modal-content::-webkit-scrollbar {
      width: 6px;
    }
    
    .modal-content::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 3px;
    }
    
    .modal-content::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class ConfirmationModalComponent {
  @Input() config!: ConfirmationModalConfig;
  @Input() isOpen = signal(false);

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
    this.close();
  }

  onCancel(): void {
    this.cancelled.emit();
    this.close();
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onCancel();
    }
  }
}

