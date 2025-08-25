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
          Validators.pattern(/^\d+[A-Z]?$/),
        ]),
        apartmentNumber: new FormControl(null, [
          Validators.maxLength(6),
          Validators.pattern(/^\d+[A-Z]?$/),
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
          Validators.pattern(/^[A-Z][\p{L} .-]*$/u),
        ]),
        country: new FormControl('', [Validators.required], [allowedCountriesAsyncValidator(this.countryService)]),
      })
      // achievements: new FormArray<FormGroup<AchievementForm>>([]),
    });
  }

  // public addAchievement(form: FormGroup<ClubForm>): void {
  //   (form.controls.achievements as FormArray<FormGroup<AchievementForm>>).push(
  //     new FormGroup<AchievementForm>({
  //       name: new FormControl('', [
  //         Validators.required,
  //         Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u)
  //       ]),
  //       date: new FormControl(null, [
  //         Validators.required
  //       ]),
  //       description: new FormControl('', [
  //         Validators.required,
  //         Validators.maxLength(500),
  //       ]),
  //     })
  //   );
  //   this.initializeAchievementDateValidator(form);
  // }

  // public deleteAchievement(form: FormGroup<ClubForm>, index: number): void {
  //   (form.controls.achievements as FormArray<FormGroup<AchievementForm>>).removeAt(index);
  // }

  // public getAchievementsFormArray(form: FormGroup<ClubForm>): FormArray<FormGroup<AchievementForm>> {
  //   return form.controls.achievements as FormArray<FormGroup<AchievementForm>>;
  // }

  // public initializeAchievementDateValidator(form: FormGroup<ClubForm>): void {
  //   const foundedYear = form.get('foundedYear')?.value ?? null;

  //   const achievementsArray = form.get('achievements') as FormArray<FormGroup<AchievementForm>>;

  //   achievementsArray.controls.forEach((achievementGroup) => {
  //     const dateControl = achievementGroup.get('date');
  //     if (dateControl) {
  //       dateControl.setValidators([achievementsDateValidator(foundedYear)]);
  //       dateControl.updateValueAndValidity({ emitEvent: false });
  //     }
  //   });
  // }
}