import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DataTableComponent,
  TableConfig,
  ModalComponent,
  ModalConfig,
  DynamicFormComponent,
  FormBuilderService,
  FormConfig
} from '../../../shared';
import { AppointmentService } from '../../../core/services/appointment.service';
// import { NotificationService } from '../../../public/notification.service';
import { NotificationService } from '../../../../app/public/notification.service';
@Component({
  selector: 'app-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule, DataTableComponent, ModalComponent, DynamicFormComponent],
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
  appointments = signal<any[]>([]);
  searchTerm = signal('');

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
      { key: 'appointmentDate', label: 'Date & Time', type: 'date', sortable: true },
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

  // ✅ Modal configuration
  modalConfig: ModalConfig = {
    title: 'New Appointment',
    size: 'xl',
    submitText: 'Create Appointment',
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
        name: 'serviceId', label: 'Service', type: 'select', required: true, options: [
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
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  onFormSubmit(formData: any): void {
    const isEdit = !!formData.id;

    const request = isEdit
      ? this.appointmentService.updateAppointment(formData.id, formData)
      : this.appointmentService.createService(formData);

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
        if (Array.isArray(err.error.errors)) {
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
        console.log('View appointment:', event.row);
        break;
      case 'edit':
        console.log('Edit appointment:', event.row);
        break;
      case 'delete':
        console.log('Delete appointment:', event.row);
        break;
    }
  }
}
