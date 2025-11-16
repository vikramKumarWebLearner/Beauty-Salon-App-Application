import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import {
  DataTableComponent,
  TableConfig,
  ModalComponent,
  ModalConfig,
  DynamicFormComponent,
  InventoryViewComponent,
  ConfirmationModalComponent,
  ConfirmationModalConfig,
  FormBuilderService,
  FormConfig,
} from '../../../shared';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InventoryService } from '../../../core/services/inventory.service';
import { NotificationService } from '../../../../app/public/notification.service';
@Component({
  selector: 'app-inventory',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent, ModalComponent, DynamicFormComponent,
    ConfirmationModalComponent, InventoryViewComponent],
  templateUrl: './inventory.html',
  styleUrl: './inventory.css',
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);
  private formBuilderService = inject(FormBuilderService);
  private toast = inject(NotificationService);
  // Signals
  loading = signal(true);
  isModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  inventory = signal<any[]>([]);
  originalInventory = signal<any[]>([]); // Store original data with IDs
  searchTerm = signal('');
  editingInventoryId = signal<string | null>(null);
  selectedInventory = signal<any>(null);
  InventoryToDelete = signal<any>(null);
  inventoryForm!: FormGroup;

  // ✅ Computed signal for search filter
  filteredInventory = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.inventory();

    if (!term) return list;

    return list.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.price.includes(term) ||
      item.description.includes(term)
    );
  });

  ngOnInit() {
    // Initialize form
    this.inventoryForm = this.formBuilderService.buildForm(this.formConfig);
    this.loadServices();

    // load category
    this.loadCategory();
  }

  // ✅ Load Services
  loadServices() {
    this.loading.set(true);// ✅ start loader before API call
    this.inventoryService.getInventory().subscribe({
      next: (res) => {
        if (res && res.success) {
          // Store original data with full information
          this.originalInventory.set(res.data || []);

          this.inventory.set(
            res.data.map((item: any) => ({
              id: item._id,
              productName: item?.productName || item.productName || 'N/A',
              sku: item.sku || item.sku,
              categoryId: item.categoryId?.name || item.categoryId?.name,
              quantity: item.quantity || item.quantity,
              stock: item.stock || item.stock,
              unit: item.unit || item.unit,
              price: item.price || item.price,
              supplierName: item.supplierName || item.supplierName,
              status: item.status || 'stock'
            }))
          );
          this.loading.set(false); // ✅ hide loader after success
        }
      },
      error: (err) => {
        console.error('Error loading inventories:', err)
        this.loading.set(false); // ✅ hide loader even after failure
      }
    });
  }

  // ✅ Update search term
  onSearch(term: string) {
    this.searchTerm.set(term);
  }


  // ✅ Load staff options dynamically
  loadCategory() {
    this.inventoryService.getCategories().subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const categoryOption = res.data.map((category: any) => ({
            value: category._id,
            label: category.name
          }));

          const categoryField = this.formConfig.fields.find(f => f.name === 'categoryId');
          if (categoryField) {
            categoryField.options = categoryOption;
          }

        }
      },
      error: (err) => {
        console.error('Error loading category list:', err);
      }
    });
  }

  // ✅ Table configuration
  tableConfig: TableConfig = {
    columns: [
      { key: 'productName', label: 'Product Name', sortable: true },
      { key: 'sku', label: 'SKU', sortable: true },
      { key: 'categoryId', label: 'Category Name', sortable: true },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'stock', label: 'Minimum Stock', sortable: true },
      { key: 'unit', label: 'Unit', sortable: true },
      { key: 'price', label: 'Price Per Unit', sortable: true },
      { key: 'supplierName', label: 'Supplier', sortable: true },
      { key: 'status', label: 'Status', type: 'status', sortable: true }
    ],
    actions: [
      { label: 'View', icon: 'eye', action: 'view' },
      { label: 'Edit', icon: 'edit', action: 'edit' },
      { label: 'Delete', icon: 'delete', action: 'delete', class: 'text-red-600 hover:text-red-800' }
    ],
    searchable: true,
    sortable: true,
    pagination: true,
    pageSize: 10
  };

  // ✅ Modal configuration (will be updated dynamically)
  modalConfig: ModalConfig = {
    title: 'New Inventory',
    size: 'xl',
    submitText: 'Create Inventory',
    cancelText: 'Cancel'
  };

  // ✅ View Modal configuration
  viewModalConfig: ModalConfig = {
    title: 'Inventory Details',
    size: 'lg',
    closable: true,
    backdropClose: true
  };

  // ✅ Delete Confirmation Modal configuration
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'Delete Inventory',
    message: 'Are you sure you want to delete this inventory? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  // ✅ Dynamic Form configuration
  formConfig: FormConfig = {
    fields: [
      { name: 'productName', label: 'Product Name', type: 'text', required: true },
      { name: 'sku', label: 'SKU', type: 'text', required: true },
      {
        name: 'categoryId',
        label: 'Category',
        type: 'select',
        required: true,
        placeholder: 'Select Category',
        options: [] // dynamically populate from API
      },
      { name: 'quantity', label: 'Quantity', type: 'number', required: true },
      { name: 'stock', label: 'Stock', type: 'number', required: true },
      { name: 'unit', label: 'Unit', type: 'number', required: true },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'supplierName', label: 'Supplier Name', type: 'text', required: true },
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        required: true,
        defaultValue: 'stock',
        options: [
          { value: 'stock', label: 'In Stock' },
          { value: 'out-stock', label: 'Out of Stock' }
        ]
      }
    ],
    submitText: 'Create Product',
    resetOnSubmit: true
  };


  // ✅ Modal Controls
  openModal(): void {
    this.editingInventoryId.set(null);
    this.modalConfig.title = 'New Inventory';
    this.formConfig.submitText = 'Create Inventory';
    this.inventoryForm.reset();
    // Reset to default values
    this.formConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.inventoryForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
    this.isModalOpen.set(true);
  }

  openEditModal(inventory: any): void {
    // Find original shift data
    const originalInventory = this.originalInventory().find(
      (item: any) => item._id === inventory.id
    );

    if (!originalInventory) {
      this.toast.show('Inventory data not found', 'error');
      return;
    }

    this.editingInventoryId.set(inventory.id);
    this.modalConfig.title = 'Edit Inventory';
    this.formConfig.submitText = 'Update Inventory';

    // Map shift data to form values
    const formValues: any = {
      id: originalInventory._id,
      productName: originalInventory?.productName || originalInventory.productName || 'N/A',
      sku: originalInventory.sku || originalInventory.sku,
      categoryId: originalInventory.categoryId?._id || originalInventory.categoryId?._id,
      quantity: originalInventory.quantity || originalInventory.quantity,
      stock: originalInventory.stock || originalInventory.stock,
      unit: originalInventory.unit || originalInventory.unit,
      price: originalInventory.price || originalInventory.price,
      supplierName: originalInventory.supplierName || originalInventory.supplierName,
      status: originalInventory.status || 'stock'
    };

    // Patch form values
    this.inventoryForm.patchValue(formValues);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingInventoryId.set(null);
    this.inventoryForm.reset();
  }

  onFormSubmit(formData: any): void {
    // Get the form value (includes id if editing)
    const formValue = this.inventoryForm.value;
    const shiftId = this.editingInventoryId();
    const isEdit = !!shiftId;

    // Prepare data for submission (exclude id from payload)
    const { id, ...submitData } = formValue;

    // Use the shift ID from signal if editing
    const request = isEdit
      ? this.inventoryService.updateInventory(shiftId!, submitData)
      : this.inventoryService.createInventory(submitData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = isEdit
            ? 'Inventory updated successfully'
            : 'Inventory created successfully';
          this.toast.show(message, 'success');
          this.loadServices();
          this.closeModal();
        } else {
          this.toast.show(res.message || 'Something went wrong', 'error');
        }
      },
      error: (err) => {
        console.error('Error saving inventory:', err);

        // ✅ Handle Express Validator (array of errors)
        if (Array.isArray(err.error?.errors)) {
          err.error.errors.forEach((validationErr: any) => {
            this.toast.show(validationErr.msg, 'error');
          });
        }
        // ✅ Handle object-style validation errors
        else if (err.status === 422 && err.error?.errors) {
          Object.values(err.error.errors).forEach((messages: any) => {
            this.toast.show(messages[0], 'error');
          });
        }
        // ✅ Handle other error types
        else if (err.error?.message) {
          this.toast.show(err.error.message, 'error');
        }
        else {
          this.toast.show('An unexpected error occurred', 'error');
        }
      },
    });
  }

  onFormCancel(): void {
    this.closeModal();
  }

  onTableAction(event: { action: string, row: any }): void {
    switch (event.action) {
      case 'view':
        this.openViewModal(event.row);
        break;
      case 'edit':
        this.openEditModal(event.row);
        break;
      case 'delete':
        this.openDeleteModal(event.row);
        break;
    }
  }

  openViewModal(inventory: any): void {
    // Find original shift data for complete details
    const originalInventory = this.originalInventory().find(
      (item: any) => item._id === inventory.id
    );
    // Prepare shift data with all fields
    const serviceData = {
      id: originalInventory._id,
      productName: originalInventory?.productName || originalInventory.productName || 'N/A',
      sku: originalInventory.sku || originalInventory.sku,
      categoryId: originalInventory.categoryId?.name || originalInventory.duration?.name,
      quantity: originalInventory.quantity || originalInventory.quantity,
      stock: originalInventory.stock || originalInventory.stock,
      unit: originalInventory.unit || originalInventory.unit,
      price: originalInventory.price || originalInventory.price,
      supplierName: originalInventory.supplierName || originalInventory.supplierName,
      status: originalInventory.status || 'stock'
    };
    console.log(serviceData);

    this.selectedInventory.set(serviceData);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedInventory.set(null);
  }

  // ✅ Delete Modal Controls
  openDeleteModal(shift: any): void {
    this.InventoryToDelete.set(shift);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.InventoryToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const shift = this.InventoryToDelete();
    if (!shift || !shift.id) {
      this.toast.show('Inventory not found', 'error');
      this.closeDeleteModal();
      return;
    }

    this.inventoryService.deleteInventory(shift.id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toast.show('Inventory deleted successfully', 'success');
          this.loadServices();
          this.closeDeleteModal();
        } else {
          this.toast.show(res.message || 'Failed to delete Inventory', 'error');
        }
      },
      error: (err) => {
        console.error('Error deleting Inventory:', err);
        if (err.error?.message) {
          this.toast.show(err.error.message, 'error');
        } else {
          this.toast.show('Failed to delete service', 'error');
        }
      }
    });
  }

  onDeleteCancel(): void {
    this.closeDeleteModal();
  }
}
