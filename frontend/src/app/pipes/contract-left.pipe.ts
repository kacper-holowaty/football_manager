import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractLeft',
  standalone: true
})
export class ContractLeftPipe implements PipeTransform {
  public transform(contractUntil: Date): string {
    const today = new Date();
    const contractDate = new Date(contractUntil);
    const timeDiff = contractDate.getTime() - today.getTime();
    if (timeDiff <= 0) return 'Contract has expired';

    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const formattedDate = contractDate.toLocaleDateString('pl-PL');

    return `${this.getExpirationMessage(days, months, years, remainingMonths)} (${formattedDate})`;
  }

  private getExpirationMessage(
    days: number,
    months: number,
    years: number,
    remainingMonths: number
  ): string {
    if (days < 30) {
      return `Contract expires in ${days} day${days !== 1 ? 's' : ''}`;
    }
    if (months < 12) {
      return `Contract expires in ${months} month${months !== 1 ? 's' : ''}`;
    }

    return `Contract expires in ${years} year${years !== 1 ? 's' : ''}${
      remainingMonths ? ` and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}` : ''
    }`;
  }
}