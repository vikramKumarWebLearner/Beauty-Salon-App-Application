import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'timeAgo',
    standalone: true
})
export class TimeAgoPipe implements PipeTransform {

    transform(value: string | Date): string {
        if (!value) return '';

        const seconds = Math.floor(
            (Date.now() - new Date(value).getTime()) / 1000
        );

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;

        return `${Math.floor(seconds / 86400)} days ago`;
    }
}
