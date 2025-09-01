import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressForm, ClubForm } from '../models/club-form.model';
import { Address, Club, ClubRequest, UpdateClubRequest } from '../models/club.model';
import { Country } from '../models/country.model';
import { CountryService } from './country.service';
import { allowedCountriesAsyncValidator } from '../components/club/club-form/validators';
import { Observable, map } from 'rxjs';
import { ClubService } from './club.service';

@Injectable({
  providedIn: 'root'
})
export class ClubFormService {
  protected currentYear = new Date().getFullYear();
  protected errorMessage: string | null = null;

  public constructor(
    private countryService: CountryService,
    private clubService: ClubService
  ) { }

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

  public mapFormValue(clubForm: FormGroup<ClubForm>): Partial<ClubForm> {
    return {
      name: clubForm.get('name') as FormControl<string | null> | undefined,
      badge: clubForm.get('badge') as FormControl<Blob | null> | undefined,
      foundedYear: clubForm.get('foundedYear') as FormControl<number | null> | undefined,
      stadiumName: clubForm.get('stadiumName') as FormControl<string | null> | undefined,
      stadiumCapacity: clubForm.get('stadiumCapacity') as FormControl<number | null> | undefined,
      address: clubForm.get('address') as FormGroup<AddressForm> | undefined,
    };
  }

  public createClubRequest(formValue: Partial<ClubForm>, currentUserId: string): ClubRequest {
    return {
      name: this.extractValue(formValue.name, ''),
      badge: this.extractValue(formValue.badge, null),
      ownerId: currentUserId,
      foundedYear: this.extractValue(formValue.foundedYear, 0),
      stadiumName: this.extractValue(formValue.stadiumName, ''),
      stadiumCapacity: this.extractValue(formValue.stadiumCapacity, 0),
      address: this.createAddress(formValue.address as FormGroup<AddressForm>),
    };
  }

  public updateClubRequest(formValue: Partial<ClubForm>, clubForm: FormGroup<ClubForm>, currentUserId: string): UpdateClubRequest {
    return {
      name: this.extractValue(formValue.name, ''),
      badge: clubForm.get('badge')?.value ?? null,
      ownerId: currentUserId,
      foundedYear: this.extractValue(formValue.foundedYear, 0),
      stadiumName: this.extractValue(formValue.stadiumName, ''),
      stadiumCapacity: this.extractValue(formValue.stadiumCapacity, 0),
      address: this.createAddress(formValue.address as FormGroup<AddressForm>),
    };
  }
  
  private extractValue<T>(control: FormControl<T | null> | undefined, defaultValue: T): T {
    return control?.value ?? defaultValue;
  }
  
  private createAddress(addressFormGroup: FormGroup<AddressForm>): Address {
    const addressFormValue = addressFormGroup.value;
  
    return {
      street: addressFormValue.street ?? '',
      houseNumber: addressFormValue.houseNumber ?? '',
      apartmentNumber: addressFormValue.apartmentNumber ?? '',
      postalCode: addressFormValue.postalCode ?? '',
      city: addressFormValue.city ?? '',
      country: addressFormValue.country ?? '',
    };
  }

  public addClub(clubRequest: ClubRequest): Observable<Club> {
    return this.clubService.addClub(clubRequest);
  }

  public updateClub(clubId: string, club: UpdateClubRequest): Observable<Club> {
    return this.clubService.updateClub(clubId, club);
  }

  public removeClubBadge(clubId: string): Observable<void> {
    return this.clubService.removeClubBadge(clubId);
  }

  public filterCountries(value: string): Observable<Country[]> {
    const filterValue = value.toLowerCase();

    return this.countryService.getCountries().pipe(
      map((countries) => countries.filter((country) => country.country.toLowerCase().includes(filterValue)))
    );
  }
}