import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimeFormatPipe } from '../../pipes/date-time-format.pipe'
export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'status' | 'actions' | 'custom';
  sortable?: boolean;
  width?: string;
  customTemplate?: string;
}

export interface TableAction {
  label: string;
  icon: string;
  action: string;
  class?: string;
  condition?: (row: any) => boolean;
}

export interface TableConfig {
  columns: TableColumn[];
  actions?: TableAction[];
  searchable?: boolean;
  sortable?: boolean;
  pagination?: boolean;
  pageSize?: number;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule, DateTimeFormatPipe],
  template: `
    <div class="space-y-4 mt-5">
      <!-- Table -->
      <div class="rounded-lg border bg-card">
        <div class="relative w-full overflow-auto">
          <table class="w-full caption-bottom text-sm">
            <thead class="[&_tr]:border-b">
              <tr class="border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50">
                @for (column of config.columns; track column.key) {
                  <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                      [style.width]="column.width">
                    @if (config.sortable && column.sortable) {
                      <button (click)="sort(column.key)" 
                              class="flex items-center gap-2 hover:text-foreground">
                        {{ column.label }}
                        @if (sortColumn() === column.key) {
                          @if (sortDirection() === 'asc') {
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                          } @else {
                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                          }
                        }
                      </button>
                    } @else {
                      {{ column.label }}
                    }
                  </th>
                }
                @if (config.actions && config.actions.length > 0) {
                  <th class="h-12 px-4 align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 text-right">
                    Actions
                  </th>
                }
              </tr>
            </thead>
            <tbody class="[&_tr:last-child]:border-0">
              @for (row of filteredData(); track getRowId(row)) {
                <tr class="border-b transition-colors data-[state=selected]:bg-muted hover:bg-muted/50">
                  @for (column of config.columns; track column.key) {
                    <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                        [class.font-medium]="column.key === 'name' || column.key === 'customerName'">
                      @switch (column.type) {
                        @case ('status') {
                          <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                               [ngClass]="getStatusClass(row[column.key])">
                            {{ row[column.key] }}
                          </div>
                        }
                        @case ('date') {
                          {{ row[column.key] | dateTimeFormat }}
                        }
                        @case ('custom') {
                          <ng-container [ngTemplateOutlet]="getCustomTemplate(column.customTemplate!)" 
                                        [ngTemplateOutletContext]="{ $implicit: row, column: column }">
                          </ng-container>
                        }
                        @default {
                          {{ row[column.key] }}
                        }
                      }
                    </td>
                  }
                  @if (config.actions && config.actions.length > 0) {
                    <td class="p-4 align-middle [&:has([role=checkbox])]:pr-0 text-right">
                      <div class="flex gap-2 justify-end">
                        @for (action of config.actions; track action.action) {
                          @if (!action.condition || action.condition(row)) {
                            <button (click)="onAction(action.action, row)"
                                    [class]="'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 ' + (action.class || '')">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4">
                                @switch (action.icon) {
                                  @case ('eye') {
                                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                    <circle cx="12" cy="12" r="3"></circle>
                                  }
                                  @case ('edit') {
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"></path>
                                    <path d="m15 5 4 4"></path>
                                  }
                                  @case ('delete') {
                                    <path d="M3 6h18"></path>
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                    <line x1="10" x2="10" y1="11" y2="17"></line>
                                    <line x1="14" x2="14" y1="11" y2="17"></line>
                                  }
                                }
                              </svg>
                            </button>
                          }
                        }
                      </div>
                    </td>
                  }
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      @if (config.pagination && totalPages() >= 1) {
  <div class="flex items-center justify-between mt-4">
    <div class="text-sm text-gray-500">
      Showing {{ (currentPage() - 1) * config.pageSize! + 1 }}
      to {{ Math.min(currentPage() * config.pageSize!, totalItems()) }}
      of {{ totalItems() }} entries
    </div>

    <div class="flex items-center space-x-2">
      <button (click)="previousPage()" 
              [disabled]="currentPage() === 1"
              class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
        Previous
      </button>
      <span class="px-3 py-1 text-sm">{{ currentPage() }} of {{ totalPages() }}</span>
      <button (click)="nextPage()" 
              [disabled]="currentPage() === totalPages()"
              class="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">
        Next
      </button>
    </div>
  </div>
}

    </div>
  `,
  styles: [`
    .lucide {
      display: inline-block;
    }
  `]
})
export class DataTableComponent {
  @Input() data: any[] = [];
  @Input() config!: TableConfig;
  @Input() searchPlaceholder: string = 'items';
  @Input() rowIdField: string = 'id';

  @Output() actionClick = new EventEmitter<{ action: string, row: any }>();

  searchTerm = signal('');
  sortColumn = signal<string>('');
  sortDirection = signal<'asc' | 'desc'>('asc');
  currentPage = signal(1);

  filteredData = signal<any[]>([]);
  totalItems = signal(0);
  totalPages = signal(0);

  Math = Math;

  ngOnInit() {
    this.updateFilteredData();
  }

  ngOnChanges(changes: any) {
    if (changes['data'] || changes['config']) {
      this.currentPage.set(1);
      this.updateFilteredData();
    }
  }


  updateFilteredData() {
    // Ensure `data` is always an array
    let filtered = Array.isArray(this.data) ? [...this.data] : [];

    // Apply search filter
    if (this.searchTerm()) {
      const term = this.searchTerm().toLowerCase();
      filtered = filtered.filter(row =>
        this.config.columns.some(col =>
          String(row[col.key]).toLowerCase().includes(term)
        )
      );
    }

    // Apply sorting
    if (this.sortColumn()) {
      filtered.sort((a, b) => {
        const aVal = a[this.sortColumn()];
        const bVal = b[this.sortColumn()];
        if (aVal < bVal) return this.sortDirection() === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortDirection() === 'asc' ? 1 : -1;
        return 0;
      });
    }

    this.totalItems.set(filtered.length);
    this.totalItems.set(filtered.length);
    // Apply pagination
    if (this.config.pagination) {
      const pageSize = this.config.pageSize || 10;
      this.totalPages.set(Math.ceil(filtered.length / pageSize));

      const startIndex = (this.currentPage() - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      filtered = filtered.slice(startIndex, endIndex);
    }

    this.filteredData.set(filtered);
  }


  onSearch() {
    this.currentPage.set(1);
    this.updateFilteredData();
  }

  sort(column: string) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
    this.updateFilteredData();
  }

  onAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.updateFilteredData();
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.updateFilteredData();
    }
  }

  getRowId(row: any): any {
    return row[this.rowIdField] || row;
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'border-transparent hover:bg-primary/80 bg-yellow-100 text-yellow-800',
      'confirmed': 'border-transparent hover:bg-primary/80 bg-green-100 text-green-800',
      'completed': 'border-transparent hover:bg-primary/80 bg-blue-100 text-blue-800',
      'cancelled': 'border-transparent hover:bg-primary/80 bg-red-100 text-red-800',
      'active': 'border-transparent hover:bg-primary/80 bg-green-100 text-green-800',
      'inactive': 'border-transparent hover:bg-primary/80 bg-gray-100 text-gray-800'
    };
    return statusClasses[status] || 'border-transparent hover:bg-primary/80 bg-gray-100 text-gray-800';
  }

  getCustomTemplate(templateName: string): any {
    // This would be implemented based on your template system
    return null;
  }
}
