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
  // StaffViewComponent,
  ConfirmationModalComponent,
  ConfirmationModalConfig,
  FormBuilderService,
  FormConfig,
} from '../../../shared';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { StaffService } from '../../../core/services/staff.service';
import { NotificationService } from '../../../../app/public/notification.service';
@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, DataTableComponent, ModalComponent, DynamicFormComponent, ConfirmationModalComponent],
  templateUrl: './staff.html',
  styleUrl: './staff.css'
})
export class Staff implements OnInit {
  private staffService = inject(StaffService);
  private formBuilderService = inject(FormBuilderService);
  private fb = inject(FormBuilder);
  private toast = inject(NotificationService);
  // Signals
  loading = signal(true);
  isModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  staffs = signal<any[]>([]);
  originalStaffs = signal<any[]>([]); // Store original data with IDs
  searchTerm = signal('');
  editingStaffId = signal<string | null>(null);
  selectedStaff = signal<any>(null);
  staffToDelete = signal<any>(null);
  staffForm!: FormGroup;

  // ✅ Computed signal for search filter
  filteredStaffs = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.staffs();

    if (!term) return list;

    return list.filter(item =>
      item.name?.toLowerCase().includes(term) ||
      item.email?.toLowerCase().includes(term) ||
      item.phone?.toLowerCase().includes(term)
      // item.experience?.includes(term)
    );
  });

  ngOnInit() {
    // Initialize form with working hours control
    this.staffForm = this.formBuilderService.buildForm(this.formConfig);
    // Add workingHours control to the form
    this.staffForm.addControl('workingHours', new FormControl(null));
    this.loadStaffs();
    // this.loadStaffOptions();
    this.loadServiceOptions();
    // this.loadUsersOptions();
  }

  // Helper method to get service options for template
  getServiceOptions() {
    const serviceField = this.formConfig.fields.find(f => f.name === 'serviceId');
    return serviceField?.options || [];
  }

  // ✅ Load staffs
  loadStaffs() {
    this.loading.set(true);// ✅ start loader before API call
    this.staffService.getStaffs().subscribe({
      next: (res) => {
        if (res && res.success) {
          // Store original data with full information
          this.originalStaffs.set(res.data || []);
          this.staffs.set(
            res.data.map((item: any) => ({
              id: item._id,
              name: item?.name || item.name || 'N/A',
              experience: item?.experience || 0,
              rating: item.rating || 0,
              status: item.status || 'pending',
              phone: item.phone || '',
              email: item.email || ''
            }))
          );
          this.loading.set(false); // ✅ hide loader after success
        }
      },
      error: (err) => {
        console.error('Error loading staffs:', err)
        this.loading.set(false); // ✅ hide loader even after failure
      }
    });
  }

  // ✅ Update search term
  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  // ✅ Load staff options dynamically
  // loadStaffOptions() {
  //   this.appointmentService.getStaffs().subscribe({
  //     next: (res) => {
  //       if (res && res.success && Array.isArray(res.data)) {
  //         const staffOptions = res.data.map((staff: any) => ({
  //           value: staff._id,
  //           label: staff.name
  //         }));

  //         const staffField = this.formConfig.fields.find(f => f.name === 'staffId');
  //         if (staffField) {
  //           staffField.options = staffOptions;
  //         }
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading staff list:', err);
  //     }
  //   });
  // }

  // ✅ Load service options dynamically
  loadServiceOptions() {
    this.staffService.getServices().subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const serviceOptions = res.data.map((service: any) => ({
            value: service._id,
            label: service.name
          }));

          const serviceField = this.formConfig.fields.find(f => f.name === 'serviceId');
          if (serviceField) {
            serviceField.options = serviceOptions;
          }
        }
      },
      error: (err) => {
        console.error('Error loading service list:', err);
      }
    });
  }

  // ✅ Load users options dynamically
  // loadUsersOptions() {
  //   this.appointmentService.getUsers().subscribe({
  //     next: (res) => {
  //       if (res && res.success && Array.isArray(res.data)) {
  //         const usersOptions = res.data.map((user: any) => ({
  //           value: user._id,
  //           label: user.name
  //         }));

  //         const usersField = this.formConfig.fields.find(f => f.name === 'userId');
  //         if (usersField) {
  //           usersField.options = usersOptions;
  //         }
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error loading users list:', err);
  //     }
  //   });
  // }
  // ✅ Table configuration
  tableConfig: TableConfig = {
    columns: [
      { key: 'name', label: 'Name', sortable: true },
      { key: 'email', label: 'Email', sortable: true },
      { key: 'phone', label: 'Phone', sortable: true },
      { key: 'experience', label: 'Experience', sortable: true },
      { key: 'rating', label: 'Rating', sortable: true },
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
    title: 'New Staff',
    size: 'xl',
    submitText: 'Create Staff',
    cancelText: 'Cancel'
  };

  // ✅ View Modal configuration
  viewModalConfig: ModalConfig = {
    title: 'Staff Details',
    size: 'lg',
    closable: true,
    backdropClose: true
  };

  // ✅ Delete Confirmation Modal configuration
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'Delete Staff',
    message: 'Are you sure you want to delete this staff? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  // ✅ Dynamic Form configuration
  formConfig: FormConfig = {
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'phone', label: 'Phone', type: 'text', required: true },
      {
        name: 'serviceId', label: 'Service', type: 'select', required: true, placeholder: 'Select Service', options: [
          { value: 'Hair Styling', label: 'Hair Styling' },
          { value: 'Haircut', label: 'Haircut' },
          { value: 'Hair Coloring', label: 'Hair Coloring' },
          { value: 'Manicure', label: 'Manicure' },
          { value: 'Pedicure', label: 'Pedicure' },
          { value: 'Facial Treatment', label: 'Facial Treatment' },
          { value: 'Massage', label: 'Massage' },
          { value: 'Eyebrow Shaping', label: 'Eyebrow Shaping' },
          { value: 'Makeup Application', label: 'Makeup Application' }
        ]
      },
      { name: 'experience', label: 'Experience', type: 'text' },
      {
        name: 'status', label: 'Status', type: 'select', required: true, defaultValue: 'Active', options: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' }
        ]
      },
      { name: 'workingHours', label: 'workingHours', type: 'workingHours', required: true }
    ],
    submitText: 'Create Staff',
    resetOnSubmit: true
  };

  // ✅ Modal Controls
  openModal(): void {
    this.editingStaffId.set(null);
    this.modalConfig.title = 'New Staff';
    this.formConfig.submitText = 'Create Staff';
    this.staffForm.reset();
    // Reset to default values
    this.formConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.staffForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
    // Reset working hours to null
    this.staffForm.get('workingHours')?.setValue(null);
    this.isModalOpen.set(true);
  }

  openEditModal(staff: any): void {
    // Find original appointment data
    const originalStaff = this.originalStaffs().find(
      (item: any) => item._id === staff.id
    );

    if (!originalStaff) {
      this.toast.show('Staff data not found', 'error');
      return;
    }

    this.editingStaffId.set(staff.id);
    this.modalConfig.title = 'Edit Staff';
    this.formConfig.submitText = 'Update Staff';
    // Map staff data to form values
    const formValues: any = {
      id: originalStaff._id,
      name: originalStaff.name || '',
      email: originalStaff.email || '',
      phone: originalStaff?.phone || staff.phone || '',
      serviceId: originalStaff.serviceId?._id || originalStaff.serviceId || '',
      status: originalStaff.status || 'Active',
      experience: originalStaff?.experience || 0
    };

    // Patch form values
    this.staffForm.patchValue(formValues);

    // Set working hours if available (will be handled by ControlValueAccessor)
    if (originalStaff.workingHours) {
      this.staffForm.get('workingHours')?.setValue(originalStaff.workingHours);
    } else {
      this.staffForm.get('workingHours')?.setValue(null);
    }

    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingStaffId.set(null);
    this.staffForm.reset();
  }

  onFormSubmit(formData: any): void {
    // Get the form value (includes id if editing)
    const formValue = this.staffForm.value;
    const staffId = this.editingStaffId();
    const isEdit = !!staffId;

    // Prepare data for submission (exclude id from payload)
    const { id, ...submitData } = formValue;

    // workingHours is already included in formValue through form control binding

    // Use the appointment ID from signal if editing
    const request = isEdit
      ? this.staffService.updateStaff(staffId!, submitData)
      : this.staffService.createStaff(submitData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = isEdit
            ? 'Staff updated successfully'
            : 'Staff created successfully';
          this.toast.show(message, 'success');
          this.loadStaffs();
          this.closeModal();
        } else {
          this.toast.show(res.message || 'Something went wrong', 'error');
        }
      },
      error: (err) => {
        console.error('Error saving staff:', err);

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

  openViewModal(staff: any): void {
    // Find original appointment data for complete details
    const originalStaff = this.originalStaffs().find(
      (item: any) => item._id === staff.id
    );
    // Prepare staff data with all fields
    const staffData = {
      name: staff.name,
      service: staff.service,
      staffDate: staff.staffDate,
      staffTime: staff.staffTime,
      staff: staff.staff,
      status: staff.status,
      phone: originalStaff.userId?.phone || staff.phone || '',
      email: originalStaff.userId?.email || staff.email || '',
      notes: originalStaff?.notes || ''
    };

    this.selectedStaff.set(originalStaff);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedStaff.set(null);
  }

  // ✅ Delete Modal Controls
  openDeleteModal(staff: any): void {
    this.staffToDelete.set(staff);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.staffToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const staff = this.staffToDelete();
    if (!staff || !staff.id) {
      this.toast.show('Staff not found', 'error');
      this.closeDeleteModal();
      return;
    }

    this.staffService.deleteStaff(staff.id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toast.show('Staff deleted successfully', 'success');
          this.loadStaffs();
          this.closeDeleteModal();
        } else {
          this.toast.show(res.message || 'Failed to delete staff', 'error');
        }
      },
      error: (err) => {
        console.error('Error deleting staff:', err);
        if (err.error?.message) {
          this.toast.show(err.error.message, 'error');
        } else {
          this.toast.show('Failed to delete staff', 'error');
        }
      }
    });
  }

  onDeleteCancel(): void {
    this.closeDeleteModal();
  }
}
