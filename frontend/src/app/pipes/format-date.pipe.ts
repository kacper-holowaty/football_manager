import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {

  transform(date: Date): string {
      return `${new Date(date).toLocaleDateString()}`;
  }
}
