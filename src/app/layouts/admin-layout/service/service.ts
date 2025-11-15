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
  ServiceViewComponent,
  ConfirmationModalComponent,
  ConfirmationModalConfig,
  FormBuilderService,
  FormConfig,
} from '../../../shared';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicePart } from '../../../core/services/service.service';
import { NotificationService } from '../../../../app/public/notification.service';
@Component({
  selector: 'app-service',
  standalone: true,
  templateUrl: './service.html',
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, DynamicFormComponent, ConfirmationModalComponent, ServiceViewComponent],
  styleUrl: './service.css',
})
export class Service implements OnInit {
  private Service = inject(ServicePart);
  private formBuilderService = inject(FormBuilderService);
  private toast = inject(NotificationService);
  // Signals
  loading = signal(true);
  isModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  service = signal<any[]>([]);
  originalService = signal<any[]>([]); // Store original data with IDs
  searchTerm = signal('');
  editingServiceId = signal<string | null>(null);
  selectedService = signal<any>(null);
  serviceToDelete = signal<any>(null);
  serviceForm!: FormGroup;

  // ✅ Computed signal for search filter
  filteredService = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.service();

    if (!term) return list;

    return list.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.price.includes(term) ||
      item.description.includes(term)
    );
  });

  ngOnInit() {
    // Initialize form
    this.serviceForm = this.formBuilderService.buildForm(this.formConfig);
    this.loadServices();
  }

  // ✅ Load Services
  loadServices() {
    this.loading.set(true);// ✅ start loader before API call
    this.Service.getService().subscribe({
      next: (res) => {
        if (res && res.success) {
          // Store original data with full information
          this.originalService.set(res.data || []);

          this.service.set(
            res.data.map((item: any) => ({
              id: item._id,
              name: item?.name || item.name || 'N/A',
              price: item.price || item.price,
              duration: item.duration?.$numberDecimal || item.duration?.$numberDecimal,
              description: item.description || item.description,
              isActive: item.isActive || item.isActive,
              status: item.status || 'pending'
            }))
          );
          this.loading.set(false); // ✅ hide loader after success
        }
      },
      error: (err) => {
        console.error('Error loading services:', err)
        this.loading.set(false); // ✅ hide loader even after failure
      }
    });
  }

  // ✅ Update search term
  onSearch(term: string) {
    this.searchTerm.set(term);
  }


  // ✅ Table configuration
  tableConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'price', label: 'Price', sortable: true },
      { key: 'duration', label: 'Time', type: 'duration', sortable: true },
      { key: 'description', label: 'Description', sortable: true },
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
    title: 'New Service',
    size: 'xl',
    submitText: 'Create Service',
    cancelText: 'Cancel'
  };

  // ✅ View Modal configuration
  viewModalConfig: ModalConfig = {
    title: 'Service Details',
    size: 'lg',
    closable: true,
    backdropClose: true
  };

  // ✅ Delete Confirmation Modal configuration
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'Delete Service',
    message: 'Are you sure you want to delete this service? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  // ✅ Dynamic Form configuration
  formConfig: FormConfig = {
    fields: [
      {
        name: 'name', label: 'Name', type: 'text', required: true
      },
      { name: 'price', label: 'Price', type: 'number', required: true },
      { name: 'duration', label: 'Duration', type: 'number', required: true },
      {
        name: 'isActive', label: 'Status', type: 'select', required: true, defaultValue: 'true', options: [
          { value: 'false', label: 'InActive' },
          { value: 'true', label: 'Active' },
        ]
      },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Additional notes or special requests', rows: 3 }
    ],
    submitText: 'Create Shift',
    resetOnSubmit: true
  };

  // ✅ Modal Controls
  openModal(): void {
    this.editingServiceId.set(null);
    this.modalConfig.title = 'New Service';
    this.formConfig.submitText = 'Create Service';
    this.serviceForm.reset();
    // Reset to default values
    this.formConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.serviceForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
    this.isModalOpen.set(true);
  }

  openEditModal(service: any): void {
    // Find original shift data
    const originalService = this.originalService().find(
      (item: any) => item._id === service.id
    );

    if (!originalService) {
      this.toast.show('Service data not found', 'error');
      return;
    }

    this.editingServiceId.set(service.id);
    this.modalConfig.title = 'Edit Service';
    this.formConfig.submitText = 'Update Service';

    // Map shift data to form values
    const formValues: any = {
      id: originalService._id,
      name: originalService?.name || originalService.name || 'N/A',
      price: originalService.price || originalService.price,
      duration: originalService.duration?.$numberDecimal || originalService.duration?.$numberDecimal,
      description: originalService.description || originalService.description,
      isActive: originalService.isActive || originalService.isActive,
      status: originalService.status || 'pending'
    };

    // Patch form values
    this.serviceForm.patchValue(formValues);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingServiceId.set(null);
    this.serviceForm.reset();
  }

  onFormSubmit(formData: any): void {
    // Get the form value (includes id if editing)
    const formValue = this.serviceForm.value;
    const shiftId = this.editingServiceId();
    const isEdit = !!shiftId;

    // Prepare data for submission (exclude id from payload)
    const { id, ...submitData } = formValue;

    // Use the shift ID from signal if editing
    const request = isEdit
      ? this.Service.updateService(shiftId!, submitData)
      : this.Service.createService(submitData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = isEdit
            ? 'Service updated successfully'
            : 'Service created successfully';
          this.toast.show(message, 'success');
          this.loadServices();
          this.closeModal();
        } else {
          this.toast.show(res.message || 'Something went wrong', 'error');
        }
      },
      error: (err) => {
        console.error('Error saving shift:', err);

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

  openViewModal(service: any): void {
    // Find original shift data for complete details
    const originalService = this.originalService().find(
      (item: any) => item._id === service.id
    );
    // Prepare shift data with all fields
    const serviceData = {
      id: originalService._id,
      name: originalService?.name || originalService.name || 'N/A',
      price: originalService.price || originalService.price,
      duration: originalService.duration?.$numberDecimal || originalService.duration?.$numberDecimal,
      description: originalService.description || originalService.description,
      // createdAt: originalService.createdAt || originalService.createdAt,
      // isActive: originalService.isActive || originalService.isActive,
      status: originalService.isActive || 'pending'
    };

    this.selectedService.set(serviceData);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedService.set(null);
  }

  // ✅ Delete Modal Controls
  openDeleteModal(shift: any): void {
    this.serviceToDelete.set(shift);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.serviceToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const shift = this.serviceToDelete();
    if (!shift || !shift.id) {
      this.toast.show('Shift not found', 'error');
      this.closeDeleteModal();
      return;
    }

    this.Service.deleteService(shift.id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toast.show('Service deleted successfully', 'success');
          this.loadServices();
          this.closeDeleteModal();
        } else {
          this.toast.show(res.message || 'Failed to delete service', 'error');
        }
      },
      error: (err) => {
        console.error('Error deleting service:', err);
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
