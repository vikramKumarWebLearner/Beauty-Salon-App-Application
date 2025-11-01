import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'dateTimeFormat',
    standalone: true,
    pure: true
})
export class DateTimeFormatPipe implements PipeTransform {
    private datePipe = new DatePipe('en-US');

    transform(value: Date | string | number): string {
        if (!value) return '';

        // Format: dd/MM/yyyy 'at' hh:mm a
        return this.datePipe.transform(value, 'dd/MM/yyyy \'at\' hh:mm a') || '';
    }
}
