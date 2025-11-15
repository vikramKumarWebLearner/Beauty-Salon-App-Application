import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'durationFormat'
})
export class DurationFormatPipe implements PipeTransform {

  transform(value: number): string {
    if (!value) return '0 mins';

    // Split hours and minutes
    const parts = value.toString().split('.');

    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parts[1] ? parseInt(parts[1], 10) : 0;

    let result = '';

    if (hours > 0) result += `${hours} hr `;
    if (minutes > 0) result += `${minutes} mins`;

    return result.trim();
  }
}
