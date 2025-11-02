import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { FormBuilderService, FormFieldConfig, FormConfig } from '../../services/form-builder.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatNativeDateModule,
    MatFormFieldModule, MatTimepickerModule, MatButtonModule, MatIconModule
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @for (field of config.fields; track field.name) {
          <div [ngClass]="getFieldColumnClass(field)">
            <label [for]="field.name" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {{ field.label }}
              @if (field.required) {
                <span class="text-red-500">*</span>
              }
            </label>

            @switch (field.type) {
              @case ('textarea') {
                <textarea 
                  [id]="field.name"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder || ''"
                  [rows]="field.rows || 3"
                  [readonly]="field.readonly"
                  [class]="getInputClasses(field.name)"
                  [class.border-red-300]="hasError(field.name)"
                  [class.focus:ring-red-500]="hasError(field.name)"
                  class="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                </textarea>
              }
              @case ('select') {
                <select 
                  [id]="field.name"
                  [formControlName]="field.name"
                  [class]="getInputClasses(field.name)"
                  [class.border-red-300]="hasError(field.name)"
                  [class.focus:ring-red-500]="hasError(field.name)"
                  class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                  >
                  <option value="" class="h-4 w-4 opacity-50">{{ field.placeholder || 'Select ' + field.label.toLowerCase() }}</option>
                  @for (option of field.options; track option.value) {
                    <option [value]="option.value" class="h-4 w-4 opacity-50">{{ option.label }}</option>
                  }
                </select>
              }
              @case ('checkbox') {
                <div class="flex items-center">
                  <input 
                    type="checkbox"
                    [id]="field.name"
                    [formControlName]="field.name"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                  <label [for]="field.name" class="ml-2 block text-sm text-gray-900">
                    {{ field.label }}
                  </label>
                </div>
              }
              @case ('date') { 
                <div class="relative">
                    <input
                      matInput
                      [matDatepicker]="picker"
                      [formControlName]="field.name"
                      [placeholder]="field.placeholder || 'Select ' + field.label.toLowerCase()"
                      [readonly]="field.readonly"
                      [class]="getInputClasses(field.name)"
                      [class.border-red-300]="hasError(field.name)"
                      [class.focus:ring-red-500]="hasError(field.name)"
                      class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    />

                    <mat-datepicker-toggle
                      matSuffix
                      [for]="picker"
                      class="!absolute right-2 top-2 text-gray-500 hover:text-gray-700 flex self-center" style="align-self: anchor-center;"
                    ></mat-datepicker-toggle>

                    <mat-datepicker #picker></mat-datepicker>
                </div>
              }
              
              @case ('time') {
              <div class="relative">
                  <input
                    matInput
                    [matTimepicker]="picker"
                    [placeholder]="field.placeholder || 'Select ' + field.label.toLowerCase()"
                    [formControlName]="field.name"
                    [readonly]="field.readonly"
                    [class.border-red-300]="hasError(field.name)"
                    [class.focus:ring-red-500]="hasError(field.name)"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  />
                  <mat-timepicker-toggle matIconSuffix [for]="picker" class="!absolute right-2 top-2 text-gray-500 hover:text-gray-700 flex self-center" style="align-self: anchor-center;"></mat-timepicker-toggle>
                  <mat-timepicker #picker></mat-timepicker>
              </div>
              }

              @case ('radio') {
                <div class="space-y-2">
                  @for (option of field.options; track option.value) {
                    <div class="flex items-center">
                      <input 
                        type="radio"
                        [id]="field.name + '_' + option.value"
                        [name]="field.name"
                        [value]="option.value"
                        [formControlName]="field.name"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300">
                      <label [for]="field.name + '_' + option.value" class="ml-2 block text-sm text-gray-900">
                        {{ option.label }}
                      </label>
                    </div>
                  }
                </div>
              }
              @default {
                <input 
                  [type]="field.type"
                  [id]="field.name"
                  [formControlName]="field.name"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="field.readonly"
                  [min]="field.min"
                  [max]="field.max"
                  [step]="field.step"
                  [class]="getInputClasses(field.name)"
                  [class.border-red-300]="hasError(field.name)"
                  [class.focus:ring-red-500]="hasError(field.name)"
                  class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  >
              }
            }

            @if (hasError(field.name)) {
              <p class="text-red-500 text-sm mt-1">
                {{ getError(field.name) }}
              </p>
            }
          </div>
        }
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-3 pt-6 border-t">
        <button 
          type="button" 
          (click)="onCancel()"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
          Cancel
        </button>
        <button 
          type="submit"
          [disabled]="form.invalid"
          class="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
          {{ config.submitText || 'Submit' }}
        </button>
      </div>
    </form>
  `
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() config!: FormConfig;
  @Input() form!: FormGroup;

  @Output() formSubmit = new EventEmitter<any>();
  @Output() formCancel = new EventEmitter<void>();

  constructor(private formBuilderService: FormBuilderService) { }

  ngOnInit() {
    if (!this.form && this.config) {
      this.form = this.formBuilderService.buildForm(this.config);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config'] && this.config && !this.form) {
      this.form = this.formBuilderService.buildForm(this.config);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.formSubmit.emit(this.form.value);
      if (this.config.resetOnSubmit) {
        this.formBuilderService.resetForm(this.form, this.config);
      }
    } else {
      this.formBuilderService.markFormGroupTouched(this.form);
    }
  }

  onCancel() {
    this.formCancel.emit();
  }

  hasError(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.touched && field.errors);
  }

  getError(fieldName: string): string | null {
    return this.formBuilderService.getFieldError(this.form, fieldName);
  }

  getInputClasses(fieldName: string): string {
    const baseClasses = 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent';
    const errorClasses = this.hasError(fieldName) ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500';
    return `${baseClasses} ${errorClasses}`;
  }

  getFieldColumnClass(field: FormFieldConfig): string {
    // Some fields might need full width
    const fullWidthFields = ['textarea', 'checkbox', 'radio'];
    return fullWidthFields.includes(field.type) ? 'md:col-span-2' : '';
  }
}
