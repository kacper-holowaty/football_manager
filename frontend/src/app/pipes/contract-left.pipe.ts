import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contractLeft',
  standalone: true
})
export class ContractLeftPipe implements PipeTransform {

  transform(contractUntil: Date): string {
    const today = new Date();
    const contractDate = new Date(contractUntil);
    const timeDiff = contractDate.getTime() - today.getTime();

    if (timeDiff <= 0) {
      return 'Kontrakt wygasł';
    }

    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30.44);
    const years = Math.floor(days / 365);
    const remainingMonths = months % 12;

    if (days < 30) {
      if (days === 1) {
        return `Kontrakt wygasa jutro (${new Date(contractUntil).toLocaleDateString()})`;
      } else {
        return `Kontrakt wygasa za ${days} dni (${new Date(contractUntil).toLocaleDateString()})`;
      }
    } else if (months < 12) {
      if (months === 1) {
        return `Kontrakt wygasa za 1 miesiąc (${new Date(contractUntil).toLocaleDateString()})`;
      } else if ([2, 3, 4].includes(months)) {
        return `Kontrakt wygasa za ${months} miesiące (${new Date(contractUntil).toLocaleDateString()})`;
      } else {
        return `Kontrakt wygasa za ${months} miesięcy (${new Date(contractUntil).toLocaleDateString()})`;
      }
    } else {
      let result = `Kontrakt wygasa za `;

      if (years === 1) {
        result += `1 rok`;
      } else if ([2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)) {
        result += `${years} lata`;
      } else {
        result += `${years} lat`;
      }

      if (remainingMonths > 0) {
        if (remainingMonths === 1) {
          result += ` i 1 miesiąc`;
        } else if ([2, 3, 4].includes(months)) {
          result += ` i ${remainingMonths} miesiące`;
        } else {
          result += ` i ${remainingMonths} miesięcy`;
        }
      }

      return `${result} (${new Date(contractUntil).toLocaleDateString()})`;
    }
  }
}
