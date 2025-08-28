import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressForm, ClubForm } from '../components/club/club-form/club-form.component';
import { CountryService } from './country.service';
import { allowedCountriesAsyncValidator } from '../components/club/club-form/validators';

@Injectable({
  providedIn: 'root'
})
export class ClubFormService {
  protected currentYear = new Date().getFullYear();

  public constructor(private countryService: CountryService) { }

  public createClubForm(): FormGroup<ClubForm> {
    return new FormGroup<ClubForm>({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u),
      ]),
      badge: new FormControl(null),
      foundedYear: new FormControl(null, [
        Validators.required,
        Validators.min(1800),
        Validators.max(this.currentYear),
      ]),
      stadiumName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(32),
        Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u),
      ]),
      stadiumCapacity: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(250000),
      ]),
      address: new FormGroup<AddressForm>({
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(32),
          Validators.pattern(/^[\p{L}\p{N}][\p{L}\p{N} .-]*$/u),
        ]),
        houseNumber: new FormControl('', [
          Validators.required,
          Validators.maxLength(6),
          Validators.pattern(/^[1-9]\d{0,4}[a-zA-Z]?$/),
        ]),
        apartmentNumber: new FormControl(null, [
          Validators.maxLength(6),
          Validators.pattern(/^[1-9]\d{0,4}$/),
        ]),
        postalCode: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(6),
          Validators.pattern(/^[A-Z\d-]{4,6}$/),
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(32),
          Validators.pattern(/^[\p{Lu}][\p{L}\p{M}]*([ -][\p{L}\p{M}]+)*$/u),
        ]),
        country: new FormControl('', [Validators.required], [allowedCountriesAsyncValidator(this.countryService)]),
      })
    });
  }

}