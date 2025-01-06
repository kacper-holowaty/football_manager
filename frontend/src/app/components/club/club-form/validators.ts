import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { catchError, debounceTime, Observable, of, switchMap } from 'rxjs';
import { CountryService } from '../../../services/country.service';

export function achievementsDateValidator(foundedYear: number | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const inputDate = new Date(control.value);
    const today = new Date();
    const earliestDate = foundedYear ? new Date(foundedYear, 0, 1) : new Date('1800-01-01');

    if (inputDate < earliestDate) {
      return { minDate: "Date is too early!" };
    }

    if (inputDate > today) {
      return { maxDate: "Date is too late!" };
    }

    return null;
  };
}

export function allowedCountriesAsyncValidator(countryService: CountryService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return countryService.getCountries().pipe(
      debounceTime(300),
      switchMap(countries => {
        const isValidCountry = countries.some(country => country.country === control.value);
        return of(isValidCountry ? null : { invalidCountry: true });
      }),
      catchError(() => of({ invalidCountry: true }))
    );
  };
}