import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

@Component({
    selector: 'app-inventory-view',
    standalone: true,
    imports: [CommonModule, LucideAngularModule],
    template: `
  <div class="space-y-4">

    <!-- Title -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">
        {{ inventory?.productName || 'N/A' }}
      </h3>

      @if (inventory?.status) {
        <span 
          [ngClass]="getStatusClass(inventory.status)"
          class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
        >
          {{ inventory.status }}
        </span>
      }
    </div>

    <div class="bg-border h-[1px] w-full"></div>

    <!-- Inventory Details -->
    <div class="space-y-4">

      <!-- Category -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="tag" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Category:</span>
        <span class="font-medium">{{ inventory?.categoryId }}</span>
      </div>

      <!-- Supplier -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="truck" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Supplier:</span>
        <span class="font-medium">{{ inventory?.supplierName }}</span>
      </div>

      <!-- SKU -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="barcode" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">SKU:</span>
        <span class="font-medium">{{ inventory?.sku }}</span>
      </div>

      <!-- Price -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="indian-rupee" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Price:</span>
        <span class="font-medium">₹{{ inventory?.price }}</span>
      </div>

      <!-- Quantity -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="package" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Quantity:</span>
        <span class="font-medium">{{ inventory?.quantity }}</span>
      </div>

      <!-- Stock -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="boxes" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Stock:</span>
        <span class="font-medium">{{ inventory?.stock }}</span>
      </div>

      <!-- Unit -->
      <div class="flex items-center gap-3 text-sm">
        <lucide-icon name="calculator" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <span class="text-muted-foreground">Unit:</span>
        <span class="font-medium">{{ inventory?.unit }}</span>
      </div>

    </div>

    <div class="bg-border h-[1px] w-full"></div>

    <!-- Notes (Optional) -->
    <!-- <div class="text-sm text-muted-foreground">
      <div class="flex items-start gap-3">
        <lucide-icon name="file-text" class="h-4 w-4 text-muted-foreground"></lucide-icon>
        <div class="flex-1">
          <span class="text-muted-foreground">Notes</span>
          <p class="text-sm pl-6">{{ inventory?.notes || 'No notes available' }}</p>
        </div>
      </div>
    </div> -->

  </div>
  `,
    styles: [
        `
      :host {
        display: block;
      }
    `,
    ],
})
export class InventoryViewComponent {
    @Input() inventory: any;

    getStatusClass(status: string) {
        const map: any = {
            stock: 'bg-green-100 text-green-800',
            low: 'bg-yellow-100 text-yellow-800',
            out: 'bg-red-100 text-red-800',
        };
        return map[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
    }
}
