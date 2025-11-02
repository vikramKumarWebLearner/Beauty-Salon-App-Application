import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'timeFormat',
    standalone: true,
    pure: true
})
export class TimeFormatPipe implements PipeTransform {
    private datePipe = new DatePipe('en-US');

    transform(value: Date | string | number): string {
        if (!value) return '';

        // ✅ Only time (12-hour format) in India timezone
        return this.datePipe.transform(value, 'hh:mm a', 'Asia/Kolkata') || '';
    }
}
