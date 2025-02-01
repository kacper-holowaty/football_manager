import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Achievement, Address, Club } from '../../../models/club.model';
import { v4 as uuidv4 } from 'uuid';
import { achievementsDateValidator } from './validators';
import { allowedCountriesAsyncValidator } from './validators';
import { Country } from '../../../models/country.model';
import { CountryService } from '../../../services/country.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClubService } from '../../../services/club.service';

export interface ClubForm {
  name: FormControl<string | null>;
  badge: FormControl<Blob | null>;
  foundedYear: FormControl<number | null>;
  stadiumName: FormControl<string | null>;
  stadiumCapacity: FormControl<number | null>;
  address: FormGroup<AddressForm>;
  achievements: FormArray<FormGroup<AchievementForm>>;
}

export interface AddressForm {
  street: FormControl<string | null>;
  houseNumber: FormControl<string | null>;
  apartmentNumber: FormControl<string | null>;
  postalCode: FormControl<string | null>;
  city: FormControl<string | null>;
  country: FormControl<string | null>;
}

export interface AchievementForm {
  name: FormControl<string | null>;
  date: FormControl<string | null>;
  description: FormControl<string | null>;
}

interface ApiError {
  status: number;
  error: {
    success: boolean;
    message: string;
  };
}

@Component({
  selector: 'app-club-form',
  standalone: true,
  imports: [
    ReactiveFormsModule, 
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    AsyncPipe
  ],
  templateUrl: './club-form.component.html',
  styleUrl: './club-form.component.scss'
})
export class ClubFormComponent implements OnInit, OnDestroy {
  protected isUserLoggedIn: boolean = false;
  protected currentUserId: string = '';
  protected club?: Club;
  protected clubForm: FormGroup<ClubForm>;
  protected editing: boolean = false;
  protected currentYear = new Date().getFullYear();
  protected countries: Country[] = [];
  protected filteredCountries: Observable<Country[]>;
  protected errorMessage: string | null = null;
  
  public constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private clubService: ClubService, private countryService: CountryService) {
    this.clubForm = new FormGroup<ClubForm>({
      name: new FormControl('', [Validators.required, 
        Validators.minLength(3), 
        Validators.maxLength(50), 
        Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u),
      ]),
      badge: new FormControl(null),
      foundedYear: new FormControl(null, [Validators.required, 
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
        country: new FormControl('', [
          Validators.required],
        [allowedCountriesAsyncValidator(this.countryService)]
        ),
      }),
      achievements: new FormArray<FormGroup<AchievementForm>>([]),
    });

    this.filteredCountries = this.clubForm.get('address.country')!.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value) => this.filterCountries(value ?? ''))
    );
  }

  protected addAchievement(): void {
    this.clubForm.controls.achievements.push(
      new FormGroup<AchievementForm>({
        name: new FormControl('',  [
          Validators.required, 
          Validators.pattern(/^[\p{L}][\p{L}\p{N} .-]*$/u)
        ]),
        date: new FormControl(null, [
          Validators.required
        ]),
        description: new FormControl('',  [
          Validators.required,
          Validators.maxLength(500),
        ]),
      })
    );
    this.initializeAchievementDateValidator();
  }

  protected initializeAchievementDateValidator(): void {
    const foundedYear = this.clubForm.get('foundedYear')?.value ?? null;

    const achievementsArray = this.clubForm.get('achievements') as FormArray<FormGroup<AchievementForm>>;

    achievementsArray.controls.forEach((achievementGroup) => {
      const dateControl = achievementGroup.get('date');
      if (dateControl) {
        dateControl.setValidators([achievementsDateValidator(foundedYear)]);
        dateControl.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  protected deleteAchievement(index: number): void {
    this.clubForm.controls.achievements.removeAt(index);
  }

  protected get achievements(): FormArray<FormGroup<AchievementForm>> {
    return this.clubForm.controls.achievements as FormArray<FormGroup<AchievementForm>>;
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.clubService.getClubById(id).subscribe((club: Club) => {
        this.club = club;
        this.clubForm.patchValue({
          name: club.name,
          badge: club.badge,
          foundedYear: club.foundedYear,
          stadiumName: club.stadiumName,
          stadiumCapacity: club.stadiumCapacity,
          address: {
            street: club.address.street,
            houseNumber: club.address.houseNumber,
            apartmentNumber: club.address.apartmentNumber,
            postalCode: club.address.postalCode,
            city: club.address.city,
            country: club.address.country,
          },
        });

        if (club.achievements.length > 0) {
          club.achievements.forEach((achievement) => {
            const formattedDate = new Date(achievement.date).toISOString().split('T')[0];
            this.achievements.push(new FormGroup<AchievementForm>({
              name: new FormControl(achievement.name, Validators.required),
              date: new FormControl(formattedDate, Validators.required),
              description: new FormControl(achievement.description, Validators.required),
            }));
          });
        }
      });
    }    

    this.countryService.getCountries().subscribe({
      next: (countries) => this.countries = countries,
      error: (err) => console.error('Error fetching countries:', err)
    });

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
    });

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });

    this.clubForm.get('foundedYear')?.valueChanges.subscribe((foundedYear) => {
      const achievementsArray = this.clubForm.get('achievements') as FormArray<FormGroup<AchievementForm>>;
      achievementsArray.controls.forEach((achievementGroup) => {
        const dateControl = achievementGroup.get('date');
        dateControl?.setValidators([achievementsDateValidator(foundedYear)]);
        dateControl?.updateValueAndValidity();
      });
    });
  }

  protected filterCountries(value: string): Observable<Country[]> {
    if (!value) {
      return of(this.countries);
    }
    const filterValue = value.toLowerCase();

    return this.countryService.getCountries().pipe(
      map((countries) => countries.filter((country) => country.country.toLowerCase().includes(filterValue)))
    );
  }

  protected badgePreviewUrl: string | null = null;
  protected badgeRemoved = false;

  protected onBadgeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files) {
      const file = input.files[0];
      console.log('Selected file:', file);
  
      if (file.type.startsWith('image/')) {
        this.handleImageFile(file);
      } else {
        console.error('Selected file is not an image.');
      }
    } else {
      console.log('No file selected.');
    }
  }

  private handleImageFile(file: Blob): void {
    if (this.badgePreviewUrl) {
      URL.revokeObjectURL(this.badgePreviewUrl);
    }
    this.badgePreviewUrl = URL.createObjectURL(file);
    this.clubForm.get('badge')?.setValue(file);
  }
  
  protected removePhoto(): void {
    if (this.badgePreviewUrl) {
      URL.revokeObjectURL(this.badgePreviewUrl);
    }
    this.badgePreviewUrl = null;
    this.clubForm.get('badge')?.setValue(null);
    this.badgeRemoved = true;
    const inputFile = document.getElementById('badge') as HTMLInputElement;
    inputFile.value = '';
    
  }

  public ngOnDestroy(): void {
    if (this.badgePreviewUrl) {
      URL.revokeObjectURL(this.badgePreviewUrl);
    }
  }

  // protected onSubmit(): void {
  //   if (this.clubForm.valid) {
  //     const formValue = this.clubForm.value;
  //     const club: Club = {
  //       clubId: this.club ? this.club.clubId : uuidv4(),
  //       name: formValue.name ?? '',
  //       badge: formValue.badge || null,
  //       ownerId: this.currentUserId,
  //       foundedYear: formValue.foundedYear ?? 0,
  //       stadiumName: formValue.stadiumName ?? '',
  //       stadiumCapacity: formValue.stadiumCapacity ?? 0,
  //       address: {
  //         street: formValue.address?.street ?? '',
  //         houseNumber: formValue.address?.houseNumber ?? '',
  //         apartmentNumber: formValue.address?.apartmentNumber ?? '',
  //         postalCode: formValue.address?.postalCode ?? '',
  //         city: formValue.address?.city ?? '',
  //         country: formValue.address?.country ?? '',
  //       },
  //       achievements: (formValue.achievements ?? []).map((achievementForm) => ({
  //         name: achievementForm.name ?? '',
  //         date: achievementForm.date ?? new Date(),
  //         description: achievementForm.description ?? '',
  //       })),
  //     };
  //     if (this.editing) {
  //       // this.clubService.updateClub(club).subscribe(() => {
  //       //   console.log("Club updated successfully!");
  //       //   this.router.navigate([`/club/${id}/main`]);
  //       // });
  //     } else {
  //       // this.clubService.addClub(club).subscribe(() => {
  //       //   console.log("Club added succesfully!");
  //       //   this.router.navigate([`/club/${club.clubId}/main`]);
  //       // });
  //       this.clubService.addClub(club).subscribe({
  //         next: () => {
  //           console.log("Club added successfully!");
  //           this.router.navigate([`/club/${club.clubId}/main`]);
  //         },
  //         error: (error) => {
  //           if (error.status === 409) {
  //             this.errorMessage = error.error.message;
  //           } else {
  //             console.error("An error occurred:", error);
  //             this.errorMessage = "An error occurred while adding the club. Please try again.";
  //           }
  //         }
  //       });
  //     }
  //   }
  // }


  protected onSubmit(): void {
    if (!this.clubForm.valid) {
      return;
    }
  
    const formValue: Partial<ClubForm> = this.mapFormValue();
    const club = this.createClub(formValue);
  
    if (this.editing) {
      this.updateClub(club);
    } else {
      this.addClub(club);
    }
  }
  
  private mapFormValue(): Partial<ClubForm> {
    return {
      name: this.clubForm.get('name') as FormControl<string | null> | undefined,
      badge: this.clubForm.get('badge') as FormControl<Blob | null> | undefined,
      foundedYear: this.clubForm.get('foundedYear') as FormControl<number | null> | undefined,
      stadiumName: this.clubForm.get('stadiumName') as FormControl<string | null> | undefined,
      stadiumCapacity: this.clubForm.get('stadiumCapacity') as FormControl<number | null> | undefined,
      address: this.clubForm.get('address') as FormGroup<AddressForm> | undefined,
      achievements: this.clubForm.get('achievements') as FormArray<FormGroup<AchievementForm>> | undefined,
    };
  }
  private createClub(formValue: Partial<ClubForm>): Club {
    return {
      clubId: this.club ? this.club.clubId : uuidv4(),
      name: this.extractValue(formValue.name, ''),
      badge: this.extractValue(formValue.badge, null),
      ownerId: this.currentUserId,
      foundedYear: this.extractValue(formValue.foundedYear, 0),
      stadiumName: this.extractValue(formValue.stadiumName, ''),
      stadiumCapacity: this.extractValue(formValue.stadiumCapacity, 0),
      address: this.createAddress(formValue.address as FormGroup<AddressForm>),
      achievements: this.createAchievements(formValue.achievements as FormArray<FormGroup<AchievementForm>>),
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
  
  private createAchievements(achievements: FormArray<FormGroup<AchievementForm>>): Achievement[] {
    return achievements.controls.map((achievementFormGroup) => {
      const achievementFormValue = achievementFormGroup.value;
  
      return {
        name: achievementFormValue.name ?? '',
        date: achievementFormValue.date ? new Date(achievementFormValue.date) : new Date(),
        description: achievementFormValue.description ?? '',
      };
    });
  }
  
  private addClub(club: Club): void {
    this.clubService.addClub(club).subscribe({
      next: () => {
        console.log("Club added successfully!");
        this.router.navigate([`/club/${club.clubId}/main`]);
      },
      error: (error: ApiError) => {
        if (error.status === 409) {
          this.errorMessage = error.error.message || "Conflict occurred.";
        } else {
          console.error("An error occurred:", error);
          this.errorMessage = "An error occurred while adding the club. Please try again.";
        }
      },
    });
  }

  private updateClub(club: Club): void {
    this.clubService.updateClub(club).subscribe({
      next: () => {
        console.log("Club updated successfully!");
        this.router.navigate([`/club/${club.clubId}/main`]);
      },
      error: (error: ApiError) => {
        if (error.status === 404) {
          this.errorMessage = error.error.message || "Club not found.";
        } else {
          console.error("An error occurred:", error);
          this.errorMessage = "An error occurred while updating the club. Please try again.";
        }
      },
    });
  }
}
