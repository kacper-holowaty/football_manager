import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class DateValidators {
  static birthDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const currentDate = new Date();
      const minDate = new Date('1900-01-01');

      if (birthDate < minDate || birthDate > currentDate) {
        return { invalidBirthDate: 'Date of birth must be between 1900 and today.' };
      }

      return null;
    };
  }

  static contractDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const contractDate = new Date(control.value);
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);

      if (contractDate < currentDate) {
        return { invalidContractDate: 'Contract date must be today or later.' };
      }

      return null;
    };
  }
}