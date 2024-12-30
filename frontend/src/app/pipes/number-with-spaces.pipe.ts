import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberWithSpaces',
  standalone: true
})
export class NumberWithSpacesPipe implements PipeTransform {
  transform(value: number | string): string {
    if (typeof value !== 'number') {
      value = Number(value);
    }
    if (isNaN(value)) {
      return '';
    }
    return value.toLocaleString('pl-PL');
  }
}
