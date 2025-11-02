import { Component, Input, Output, EventEmitter, signal, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ModalConfig {
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closable?: boolean;
  backdropClose?: boolean;
  showFooter?: boolean;
  submitText?: string;
  cancelText?: string;
  submitDisabled?: boolean;
}

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 modal-backdrop" 
           (click)="onBackdropClick($event)">
        <div class="bg-white rounded-lg shadow-xl w-full mx-4 max-h-[90vh] overflow-y-auto modal-content modal-enter"
             [ngClass]="getModalSizeClass()">
          
          <!-- Modal Header -->
          <div class="flex items-center justify-between pt-6 pl-6 pr-6">
            <h2 class="text-lg font-semibold leading-none tracking-tight">{{ config.title }}</h2>
            @if (config.closable !== false) {
              <button (click)="close()" 
                      class="right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            }
          </div>

          <!-- Modal Body -->
          <div class="p-6">
            <ng-content></ng-content>
          </div>

          <!-- Modal Footer -->
          <!-- @if (config.showFooter !== false) {
            <div class="flex justify-end space-x-3 p-6 border-t bg-gray-50">
              <button 
                type="button" 
                (click)="close()"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors">
                {{ config.cancelText || 'Cancel' }}
              </button>
              <button 
                type="button"
                (click)="submit()"
                [disabled]="config.submitDisabled"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                {{ config.submitText || 'Submit' }}
              </button>
            </div>
          } -->
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
export class ModalComponent {
  @Input() config!: ModalConfig;
  @Input() isOpen = signal(false);

  @Output() closed = new EventEmitter<void>();
  @Output() submitted = new EventEmitter<void>();

  open(): void {
    this.isOpen.set(true);
  }

  close(): void {
    this.isOpen.set(false);
    this.closed.emit();
  }

  submit(): void {
    this.submitted.emit();
  }

  onBackdropClick(event: Event): void {
    if (this.config.backdropClose !== false && event.target === event.currentTarget) {
      this.close();
    }
  }

  getModalSizeClass(): string {
    const sizeClasses = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-2xl',
      'full': 'max-w-full'
    };
    return sizeClasses[this.config.size || 'md'];
  }
}
