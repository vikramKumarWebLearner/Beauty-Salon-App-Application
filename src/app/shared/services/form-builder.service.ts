import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';

export interface FormFieldConfig {
    name: string;
    label: string;
    type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'time' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'number' | 'workingHours';
    placeholder?: string;
    required?: boolean;
    validators?: any[];
    options?: { value: any; label: string }[];
    defaultValue?: any;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number; // for textarea
    min?: number; // for number inputs
    max?: number; // for number inputs
    step?: number; // for number inputs
    pattern?: string; // for pattern validation
    minLength?: number;
    maxLength?: number;
    customValidation?: (control: AbstractControl) => any;
}

export interface FormConfig {
    fields: FormFieldConfig[];
    submitText?: string;
    resetOnSubmit?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class FormBuilderService {
    constructor(private fb: FormBuilder) { }

    buildForm(config: FormConfig): FormGroup {
        const formControls: { [key: string]: any } = {};

        config.fields.forEach(field => {
            const validators = this.buildValidators(field);
            formControls[field.name] = [
                { value: field.defaultValue || '', disabled: field.disabled || false },
                validators
            ];
        });

        return this.fb.group(formControls);
    }

    private buildValidators(field: FormFieldConfig): any[] {
        const validators: any[] = [];

        if (field.required) {
            validators.push(Validators.required);
        }

        if (field.minLength) {
            validators.push(Validators.minLength(field.minLength));
        }

        if (field.maxLength) {
            validators.push(Validators.maxLength(field.maxLength));
        }

        if (field.type === 'email') {
            validators.push(Validators.email);
        }

        if (field.type === 'number') {
            // HTML5 number input handles type validation, but we can add min/max validators
            if (field.min !== undefined) {
                validators.push(Validators.min(field.min));
            }
            if (field.max !== undefined) {
                validators.push(Validators.max(field.max));
            }
        }

        if (field.type === 'tel' && field.pattern) {
            validators.push(Validators.pattern(field.pattern));
        }

        if (field.customValidation) {
            validators.push(field.customValidation);
        }

        if (field.validators) {
            validators.push(...field.validators);
        }

        return validators;
    }

    getFieldError(form: FormGroup, fieldName: string): string | null {
        const field = form.get(fieldName);
        if (!field || !field.touched || !field.errors) {
            return null;
        }

        const errors = field.errors;

        if (errors['required']) {
            return `${this.getFieldLabel(fieldName)} is required`;
        }

        if (errors['email']) {
            return 'Please enter a valid email address';
        }

        if (errors['minlength']) {
            return `${this.getFieldLabel(fieldName)} must be at least ${errors['minlength'].requiredLength} characters`;
        }

        if (errors['maxlength']) {
            return `${this.getFieldLabel(fieldName)} must be no more than ${errors['maxlength'].requiredLength} characters`;
        }

        if (errors['pattern']) {
            return `Please enter a valid ${this.getFieldLabel(fieldName).toLowerCase()}`;
        }

        if (errors['min']) {
            return `${this.getFieldLabel(fieldName)} must be at least ${errors['min'].min}`;
        }

        if (errors['max']) {
            return `${this.getFieldLabel(fieldName)} must be no more than ${errors['max'].max}`;
        }

        if (errors['number']) {
            return 'Phone Number is Valid.';
        }
        return 'Invalid input';
    }

    private getFieldLabel(fieldName: string): string {
        // remove common suffixes like Id, _id, or id
        fieldName = fieldName.replace(/(_id|Id|id)$/i, '');

        return fieldName
            .replace(/([A-Z])/g, ' $1')      // split camelCase
            .replace(/^./, str => str.toUpperCase()) // capitalize first letter
            .trim();
    }


    markFormGroupTouched(form: FormGroup): void {
        Object.keys(form.controls).forEach(key => {
            const control = form.get(key);
            control?.markAsTouched();
        });
    }

    resetForm(form: FormGroup, config: FormConfig): void {
        form.reset();
        config.fields.forEach(field => {
            if (field.defaultValue !== undefined) {
                form.get(field.name)?.setValue(field.defaultValue);
            }
        });
    }
}
