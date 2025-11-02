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
  ShiftViewComponent,
  ConfirmationModalComponent,
  ConfirmationModalConfig,
  FormBuilderService,
  FormConfig
} from '../../../shared';
import { ShiftService } from '../../../core/services/shift.service';
// import { NotificationService } from '../../../public/notification.service';
import { NotificationService } from '../../../../app/public/notification.service';
import { TimeFormatPipe } from '../../../shared/pipes/timeFormat.pipe';
@Component({
  selector: 'app-shifts',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, DynamicFormComponent, ShiftViewComponent, ConfirmationModalComponent],
  templateUrl: './shifts.html',
  styleUrl: './shifts.css'
})
export class Shifts implements OnInit {
  private shiftService = inject(ShiftService);
  private formBuilderService = inject(FormBuilderService);
  private toast = inject(NotificationService);
  // Signals
  loading = signal(true);
  isModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  shifts = signal<any[]>([]);
  originalShifts = signal<any[]>([]); // Store original data with IDs
  searchTerm = signal('');
  editingShiftId = signal<string | null>(null);
  selectedShift = signal<any>(null);
  shiftToDelete = signal<any>(null);
  shiftForm!: FormGroup;

  // ✅ Computed signal for search filter
  filteredShifts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.shifts();

    if (!term) return list;

    return list.filter(item =>
      item.staffName?.toLowerCase().includes(term) ||
      item.location?.toLowerCase().includes(term) ||
      item.date?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    // Initialize form
    this.shiftForm = this.formBuilderService.buildForm(this.formConfig);
    this.loadShifts();
    this.loadStaffOptions();
  }

  // ✅ Load shifts
  loadShifts() {
    this.loading.set(true);// ✅ start loader before API call
    this.shiftService.getShifts().subscribe({
      next: (res) => {
        if (res && res.success) {
          // Store original data with full information
          this.originalShifts.set(res.data || []);

          this.shifts.set(
            res.data.map((item: any) => ({
              id: item._id,
              staffName: item.staffId?.name || item.staffName || 'N/A',
              date: item.date || item.shiftDate,
              startTime: item.startTime || item.startTime,
              endTime: item.endTime || item.endTime,
              location: item.location || 'Not Assigned',
              status: item.status || 'pending'
            }))
          );
          this.loading.set(false); // ✅ hide loader after success
        }
      },
      error: (err) => {
        console.error('Error loading shifts:', err)
        this.loading.set(false); // ✅ hide loader even after failure
      }
    });
  }

  // ✅ Update search term
  onSearch(term: string) {
    this.searchTerm.set(term);
  }

  // ✅ Load staff options dynamically
  loadStaffOptions() {
    this.shiftService.getStaffs().subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const staffOptions = res.data.map((staff: any) => ({
            value: staff._id,
            label: staff.name
          }));

          const staffField = this.formConfig.fields.find(f => f.name === 'staffId');
          if (staffField) {
            staffField.options = staffOptions;
          }
        }
      },
      error: (err) => {
        console.error('Error loading staff list:', err);
      }
    });
  }

  // ✅ Table configuration
  tableConfig: TableConfig = {
    columns: [
      { key: 'staffName', label: 'Staff', sortable: true },
      { key: 'date', label: 'Date', type: 'date', sortable: true },
      { key: 'startTime', label: 'Start Time', type: 'time', sortable: true },
      { key: 'endTime', label: 'End Time', type: 'time', sortable: true },
      { key: 'location', label: 'Location', sortable: true },
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
    title: 'New Shift',
    size: 'xl',
    submitText: 'Create Shift',
    cancelText: 'Cancel'
  };

  // ✅ View Modal configuration
  viewModalConfig: ModalConfig = {
    title: 'Shift Details',
    size: 'lg',
    closable: true,
    backdropClose: true
  };

  // ✅ Delete Confirmation Modal configuration
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'Delete Shift',
    message: 'Are you sure you want to delete this shift? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  // ✅ Dynamic Form configuration
  formConfig: FormConfig = {
    fields: [
      {
        name: 'staffId', label: 'Staff Member', type: 'select', required: true, options: [
          { value: 'Emma Wilson', label: 'Emma Wilson' },
          { value: 'Sophie Brown', label: 'Sophie Brown' },
          { value: 'Jessica Davis', label: 'Jessica Davis' },
          { value: 'Michael Chen', label: 'Michael Chen' },
          { value: 'Sarah Johnson', label: 'Sarah Johnson' },
          { value: 'Lisa Anderson', label: 'Lisa Anderson' }
        ]
      },
      { name: 'date', label: 'Date', type: 'date', required: true },
      { name: 'startTime', label: 'Start Time', type: 'time', required: true },
      { name: 'endTime', label: 'End Time', type: 'time', required: true },
      { name: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
      {
        name: 'status', label: 'Status', type: 'select', required: true, defaultValue: 'pending', options: [
          { value: 'pending', label: 'Pending' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes or special requests', rows: 3 }
    ],
    submitText: 'Create Shift',
    resetOnSubmit: true
  };

  // ✅ Modal Controls
  openModal(): void {
    this.editingShiftId.set(null);
    this.modalConfig.title = 'New Shift';
    this.formConfig.submitText = 'Create Shift';
    this.shiftForm.reset();
    // Reset to default values
    this.formConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.shiftForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
    this.isModalOpen.set(true);
  }

  openEditModal(shift: any): void {
    // Find original shift data
    const originalShift = this.originalShifts().find(
      (item: any) => item._id === shift.id
    );

    if (!originalShift) {
      this.toast.show('Shift data not found', 'error');
      return;
    }

    this.editingShiftId.set(shift.id);
    this.modalConfig.title = 'Edit Shift';
    this.formConfig.submitText = 'Update Shift';

    // Convert date string to Date object for Material datepicker
    const dateValue = originalShift.date || originalShift.shiftDate || '';
    const dateObj = dateValue ? new Date(dateValue) : null;

    // Map shift data to form values
    const formValues: any = {
      id: originalShift._id,
      staffId: originalShift.staffId?._id || originalShift.staffId || '',
      date: dateObj,
      startTime: originalShift.startTime || '',
      endTime: originalShift.endTime || '',
      location: originalShift.location || '',
      status: originalShift.status || 'pending',
      notes: originalShift.notes || ''
    };

    // Patch form values
    this.shiftForm.patchValue(formValues);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingShiftId.set(null);
    this.shiftForm.reset();
  }

  onFormSubmit(formData: any): void {
    // Get the form value (includes id if editing)
    const formValue = this.shiftForm.value;
    const shiftId = this.editingShiftId();
    const isEdit = !!shiftId;

    // Prepare data for submission (exclude id from payload)
    const { id, ...submitData } = formValue;

    // Use the shift ID from signal if editing
    const request = isEdit
      ? this.shiftService.updateShift(shiftId!, submitData)
      : this.shiftService.createShift(submitData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = isEdit
            ? 'Shift updated successfully'
            : 'Shift created successfully';
          this.toast.show(message, 'success');
          this.loadShifts();
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

  openViewModal(shift: any): void {
    // Find original shift data for complete details
    const originalShift = this.originalShifts().find(
      (item: any) => item._id === shift.id
    );
    // Prepare shift data with all fields
    const shiftData = {
      staffName: shift.staffName,
      date: shift.date,
      startTime: shift.startTime,
      endTime: shift.endTime,
      location: shift.location,
      status: shift.status,
      notes: originalShift?.notes || ''
    };

    this.selectedShift.set(shiftData);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedShift.set(null);
  }

  // ✅ Delete Modal Controls
  openDeleteModal(shift: any): void {
    this.shiftToDelete.set(shift);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.shiftToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const shift = this.shiftToDelete();
    if (!shift || !shift.id) {
      this.toast.show('Shift not found', 'error');
      this.closeDeleteModal();
      return;
    }

    this.shiftService.deleteShift(shift.id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toast.show('Shift deleted successfully', 'success');
          this.loadShifts();
          this.closeDeleteModal();
        } else {
          this.toast.show(res.message || 'Failed to delete shift', 'error');
        }
      },
      error: (err) => {
        console.error('Error deleting shift:', err);
        if (err.error?.message) {
          this.toast.show(err.error.message, 'error');
        } else {
          this.toast.show('Failed to delete shift', 'error');
        }
      }
    });
  }

  onDeleteCancel(): void {
    this.closeDeleteModal();
  }
}

