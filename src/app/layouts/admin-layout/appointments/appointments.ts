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
  AppointmentViewComponent,
  ConfirmationModalComponent,
  ConfirmationModalConfig,
  FormBuilderService,
  FormConfig
} from '../../../shared';
import { AppointmentService } from '../../../core/services/appointment.service';
// import { NotificationService } from '../../../public/notification.service';
import { NotificationService } from '../../../../app/public/notification.service';
import { TimeFormatPipe } from '../../../shared/pipes/timeFormat.pipe';
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, DynamicFormComponent, AppointmentViewComponent, ConfirmationModalComponent],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css'
})
export class Appointments implements OnInit {
  private appointmentService = inject(AppointmentService);
  private formBuilderService = inject(FormBuilderService);
  private toast = inject(NotificationService);
  // Signals
  loading = signal(true);
  isModalOpen = signal(false);
  isViewModalOpen = signal(false);
  isDeleteModalOpen = signal(false);
  appointments = signal<any[]>([]);
  originalAppointments = signal<any[]>([]); // Store original data with IDs
  searchTerm = signal('');
  editingAppointmentId = signal<string | null>(null);
  selectedAppointment = signal<any>(null);
  appointmentToDelete = signal<any>(null);
  appointmentForm!: FormGroup;

  // ✅ Computed signal for search filter
  filteredAppointments = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const list = this.appointments();

    if (!term) return list;

    return list.filter(item =>
      item.customerName?.toLowerCase().includes(term) ||
      item.service?.toLowerCase().includes(term) ||
      item.appointmentDate?.toLowerCase().includes(term)
    );
  });

  ngOnInit() {
    // Initialize form
    this.appointmentForm = this.formBuilderService.buildForm(this.formConfig);
    this.loadAppointments();
    this.loadStaffOptions();
    this.loadServiceOptions();
    this.loadUsersOptions();
  }

  // ✅ Load appointments
  loadAppointments() {
    this.loading.set(true);// ✅ start loader before API call
    this.appointmentService.getAppointments().subscribe({
      next: (res) => {
        if (res && res.success) {
          // Store original data with full information
          this.originalAppointments.set(res.data || []);

          this.appointments.set(
            res.data.map((item: any) => ({
              id: item._id,
              customerName: item.userId?.name || item.name || 'N/A',
              service: item.serviceId?.name || item.service || 'N/A',
              appointmentDate: item.date || item.appointmentDate,
              appointmentTime: item.time || item.appointmentTime,
              staff: item.staffId?.name || 'Not Assigned',
              status: item.status || 'pending',
              phone: item.phone || '',
              email: item.email || ''
            }))
          );
          this.loading.set(false); // ✅ hide loader after success
        }
      },
      error: (err) => {
        console.error('Error loading appointments:', err)
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
    this.appointmentService.getStaffs().subscribe({
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

  // ✅ Load service options dynamically
  loadServiceOptions() {
    this.appointmentService.getServices().subscribe({
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
  loadUsersOptions() {
    this.appointmentService.getUsers().subscribe({
      next: (res) => {
        if (res && res.success && Array.isArray(res.data)) {
          const usersOptions = res.data.map((user: any) => ({
            value: user._id,
            label: user.name
          }));

          const usersField = this.formConfig.fields.find(f => f.name === 'userId');
          if (usersField) {
            usersField.options = usersOptions;
          }
        }
      },
      error: (err) => {
        console.error('Error loading users list:', err);
      }
    });
  }
  // ✅ Table configuration
  tableConfig: TableConfig = {
    columns: [
      { key: 'customerName', label: 'Customer', sortable: true },
      { key: 'service', label: 'Service', sortable: true },
      { key: 'appointmentDate', label: 'Date', type: 'date', sortable: true },
      { key: 'appointmentTime', label: 'Time', type: 'time', sortable: true },
      { key: 'staff', label: 'Staff', sortable: true },
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
    title: 'New Appointment',
    size: 'xl',
    submitText: 'Create Appointment',
    cancelText: 'Cancel'
  };

  // ✅ View Modal configuration
  viewModalConfig: ModalConfig = {
    title: 'Appointment Details',
    size: 'lg',
    closable: true,
    backdropClose: true
  };

  // ✅ Delete Confirmation Modal configuration
  deleteModalConfig: ConfirmationModalConfig = {
    title: 'Delete Appointment',
    message: 'Are you sure you want to delete this appointment? This action cannot be undone.',
    confirmText: 'Delete',
    cancelText: 'Cancel'
  };

  // ✅ Dynamic Form configuration
  formConfig: FormConfig = {
    fields: [
      {
        name: 'userId', label: 'User', type: 'select', required: true, options: [
          { value: 'Emma Wilson', label: 'Emma Wilson' },
          { value: 'Sophie Brown', label: 'Sophie Brown' },
          { value: 'Jessica Davis', label: 'Jessica Davis' },
          { value: 'Michael Chen', label: 'Michael Chen' },
          { value: 'Sarah Johnson', label: 'Sarah Johnson' },
          { value: 'Lisa Anderson', label: 'Lisa Anderson' }
        ]
      },
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
      { name: 'time', label: 'Time', type: 'time', required: true },
      {
        name: 'status', label: 'Status', type: 'select', required: true, defaultValue: 'pending', options: [
          { value: 'pending', label: 'Pending' },
          { value: 'confirmed', label: 'Confirmed' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]
      },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Additional notes or special requests', rows: 3 }
    ],
    submitText: 'Create Appointment',
    resetOnSubmit: true
  };

  // ✅ Modal Controls
  openModal(): void {
    this.editingAppointmentId.set(null);
    this.modalConfig.title = 'New Appointment';
    this.formConfig.submitText = 'Create Appointment';
    this.appointmentForm.reset();
    // Reset to default values
    this.formConfig.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        this.appointmentForm.get(field.name)?.setValue(field.defaultValue);
      }
    });
    this.isModalOpen.set(true);
  }

  openEditModal(appointment: any): void {
    // Find original appointment data
    const originalAppointment = this.originalAppointments().find(
      (item: any) => item._id === appointment.id
    );

    if (!originalAppointment) {
      this.toast.show('Appointment data not found', 'error');
      return;
    }

    this.editingAppointmentId.set(appointment.id);
    this.modalConfig.title = 'Edit Appointment';
    this.formConfig.submitText = 'Update Appointment';

    // Convert date string to Date object for Material datepicker
    const dateValue = originalAppointment.date || originalAppointment.appointmentDate || '';
    const dateObj = dateValue ? new Date(dateValue) : null;
    console.log(originalAppointment.time);

    // Map appointment data to form values
    const formValues: any = {
      id: originalAppointment._id,
      userId: originalAppointment.userId?._id || originalAppointment.userId || '',
      serviceId: originalAppointment.serviceId?._id || originalAppointment.serviceId || '',
      staffId: originalAppointment.staffId?._id || originalAppointment.staffId || '',
      date: dateObj,
      time: originalAppointment.time || originalAppointment.appointmentTime || '',
      status: originalAppointment.status || 'pending',
      notes: originalAppointment.notes || ''
    };

    // Patch form values
    this.appointmentForm.patchValue(formValues);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.editingAppointmentId.set(null);
    this.appointmentForm.reset();
  }

  onFormSubmit(formData: any): void {
    // Get the form value (includes id if editing)
    const formValue = this.appointmentForm.value;
    const appointmentId = this.editingAppointmentId();
    const isEdit = !!appointmentId;

    // Prepare data for submission (exclude id from payload)
    const { id, ...submitData } = formValue;

    // Use the appointment ID from signal if editing
    const request = isEdit
      ? this.appointmentService.updateAppointment(appointmentId!, submitData)
      : this.appointmentService.createService(submitData);

    request.subscribe({
      next: (res: any) => {
        if (res.success) {
          const message = isEdit
            ? 'Appointment updated successfully'
            : 'Appointment created successfully';
          this.toast.show(message, 'success');
          this.loadAppointments();
          this.closeModal();
        } else {
          this.toast.show(res.message || 'Something went wrong', 'error');
        }
      },
      error: (err) => {
        console.error('Error saving appointment:', err);

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

  openViewModal(appointment: any): void {
    // Find original appointment data for complete details
    const originalAppointment = this.originalAppointments().find(
      (item: any) => item._id === appointment.id
    );
    // Prepare appointment data with all fields
    const appointmentData = {
      customerName: appointment.customerName,
      service: appointment.service,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      staff: appointment.staff,
      status: appointment.status,
      phone: originalAppointment.userId?.phone || appointment.phone || '',
      email: originalAppointment.userId?.email || appointment.email || '',
      notes: originalAppointment?.notes || ''
    };

    this.selectedAppointment.set(appointmentData);
    this.isViewModalOpen.set(true);
  }

  closeViewModal(): void {
    this.isViewModalOpen.set(false);
    this.selectedAppointment.set(null);
  }

  // ✅ Delete Modal Controls
  openDeleteModal(appointment: any): void {
    this.appointmentToDelete.set(appointment);
    this.isDeleteModalOpen.set(true);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.appointmentToDelete.set(null);
  }

  onDeleteConfirm(): void {
    const appointment = this.appointmentToDelete();
    if (!appointment || !appointment.id) {
      this.toast.show('Appointment not found', 'error');
      this.closeDeleteModal();
      return;
    }

    this.appointmentService.deleteAppointment(appointment.id).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          this.toast.show('Appointment deleted successfully', 'success');
          this.loadAppointments();
          this.closeDeleteModal();
        } else {
          this.toast.show(res.message || 'Failed to delete appointment', 'error');
        }
      },
      error: (err) => {
        console.error('Error deleting appointment:', err);
        if (err.error?.message) {
          this.toast.show(err.error.message, 'error');
        } else {
          this.toast.show('Failed to delete appointment', 'error');
        }
      }
    });
  }

  onDeleteCancel(): void {
    this.closeDeleteModal();
  }
}
