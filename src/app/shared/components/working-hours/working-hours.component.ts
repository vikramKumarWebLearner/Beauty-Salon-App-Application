import { Component, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';

interface DaySchedule {
  start: string;
  end: string;
  isWorking: boolean;
}

interface WorkingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

@Component({
  selector: 'app-working-hours',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WorkingHoursComponent),
      multi: true
    }
  ],
  template: `
    <div class="space-y-3" [formGroup]="workingHoursForm">
      <!-- <h3 class="text-lg font-semibold mb-4 text-gray-800">Working Hours</h3> -->
      
      <div class="space-y-2">
        @for (day of days; track day.key) {
          <div class="flex items-center gap-3 p-2.5 border rounded-md hover:bg-gray-50 transition-colors">
            <!-- Day Name -->
            <div class="w-28 font-medium text-sm text-gray-700">
              {{ day.label }}
            </div>
            
            <!-- Working Checkbox -->
            <div class="flex items-center min-w-[100px]">
              <mat-checkbox
                [formControlName]="day.key + '_isWorking'"
                (change)="onWorkingChange(day.key, $event)"
                class="mr-2">
              </mat-checkbox>
              <span class="text-xs text-gray-600">Working</span>
            </div>
            
            <!-- Start Time -->
            <div class="flex-1 min-w-[120px]">
              <input
                type="time"
                [formControlName]="day.key + '_start'"
                [disabled]="!workingHoursForm.get(day.key + '_isWorking')?.value"
                placeholder="00:00"
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              />
            </div>
            
            <span class="text-gray-400 text-sm mx-1">-</span>
            
            <!-- End Time -->
            <div class="flex-1 min-w-[120px]">
              <input
                type="time"
                [formControlName]="day.key + '_end'"
                [disabled]="!workingHoursForm.get(day.key + '_isWorking')?.value"
                placeholder="00:00"
                class="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
              />
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class WorkingHoursComponent implements OnInit, ControlValueAccessor {
  workingHoursForm!: FormGroup;

  days = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  private onChange = (value: WorkingHours) => { };
  private onTouched = () => { };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    const formControls: any = {};

    this.days.forEach(day => {
      formControls[day.key + '_isWorking'] = this.fb.control(false);
      formControls[day.key + '_start'] = this.fb.control({ value: '00:00', disabled: true });
      formControls[day.key + '_end'] = this.fb.control({ value: '00:00', disabled: true });
    });

    this.workingHoursForm = this.fb.group(formControls);

    // Listen to form changes and propagate to parent
    this.workingHoursForm.valueChanges.subscribe(() => {
      this.propagateChange();
    });
  }

  setFormValue(value: WorkingHours) {
    this.days.forEach(day => {
      const dayData = value[day.key as keyof WorkingHours];
      if (dayData) {
        this.workingHoursForm.get(day.key + '_isWorking')?.setValue(dayData.isWorking || false, { emitEvent: false });
        this.workingHoursForm.get(day.key + '_start')?.setValue(dayData.start || '00:00', { emitEvent: false });
        this.workingHoursForm.get(day.key + '_end')?.setValue(dayData.end || '00:00', { emitEvent: false });
        this.updateDayControls(day.key, dayData.isWorking || false);
      }
    });
    this.propagateChange();
  }

  onWorkingChange(dayKey: string, event: any) {
    const isWorking = event.checked;
    this.updateDayControls(dayKey, isWorking);
    this.propagateChange();
  }

  updateDayControls(dayKey: string, isWorking: boolean) {
    const startControl = this.workingHoursForm.get(dayKey + '_start');
    const endControl = this.workingHoursForm.get(dayKey + '_end');

    if (isWorking) {
      startControl?.enable();
      endControl?.enable();
      // Set default time if not set
      if (!startControl?.value || startControl.value === '00:00') {
        startControl?.setValue('10:00');
      }
      if (!endControl?.value || endControl.value === '00:00') {
        endControl?.setValue('18:00');
      }
    } else {
      startControl?.disable();
      endControl?.disable();
      startControl?.setValue('00:00');
      endControl?.setValue('00:00');
    }
  }

  propagateChange() {
    const workingHours: WorkingHours = {
      monday: {
        isWorking: this.workingHoursForm.get('monday_isWorking')?.value || false,
        start: this.workingHoursForm.get('monday_start')?.value || '00:00',
        end: this.workingHoursForm.get('monday_end')?.value || '00:00'
      },
      tuesday: {
        isWorking: this.workingHoursForm.get('tuesday_isWorking')?.value || false,
        start: this.workingHoursForm.get('tuesday_start')?.value || '00:00',
        end: this.workingHoursForm.get('tuesday_end')?.value || '00:00'
      },
      wednesday: {
        isWorking: this.workingHoursForm.get('wednesday_isWorking')?.value || false,
        start: this.workingHoursForm.get('wednesday_start')?.value || '00:00',
        end: this.workingHoursForm.get('wednesday_end')?.value || '00:00'
      },
      thursday: {
        isWorking: this.workingHoursForm.get('thursday_isWorking')?.value || false,
        start: this.workingHoursForm.get('thursday_start')?.value || '00:00',
        end: this.workingHoursForm.get('thursday_end')?.value || '00:00'
      },
      friday: {
        isWorking: this.workingHoursForm.get('friday_isWorking')?.value || false,
        start: this.workingHoursForm.get('friday_start')?.value || '00:00',
        end: this.workingHoursForm.get('friday_end')?.value || '00:00'
      },
      saturday: {
        isWorking: this.workingHoursForm.get('saturday_isWorking')?.value || false,
        start: this.workingHoursForm.get('saturday_start')?.value || '00:00',
        end: this.workingHoursForm.get('saturday_end')?.value || '00:00'
      },
      sunday: {
        isWorking: this.workingHoursForm.get('sunday_isWorking')?.value || false,
        start: this.workingHoursForm.get('sunday_start')?.value || '00:00',
        end: this.workingHoursForm.get('sunday_end')?.value || '00:00'
      }
    };

    this.onChange(workingHours);
  }


  // ControlValueAccessor implementation
  writeValue(value: WorkingHours): void {
    if (value && this.workingHoursForm) {
      this.setFormValue(value);
    }
  }

  registerOnChange(fn: (value: WorkingHours) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.workingHoursForm.disable();
    } else {
      this.workingHoursForm.enable();
    }
  }
}

