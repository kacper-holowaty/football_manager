import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClubFormService } from '../../../services/club-form.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Achievement, Address, Club } from '../../../models/club.model';
import { v4 as uuidv4 } from 'uuid';
import { Country } from '../../../models/country.model';
import { CountryService } from '../../../services/country.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClubService } from '../../../services/club.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { ToastService } from '../../../services/toast.service';

export interface ClubForm {
  readonly name: FormControl<string | null>;
  readonly badge: FormControl<Blob | null>;
  readonly foundedYear: FormControl<number | null>;
  readonly stadiumName: FormControl<string | null>;
  readonly stadiumCapacity: FormControl<number | null>;
  readonly address: FormGroup<AddressForm>;
  readonly achievements: FormArray<FormGroup<AchievementForm>>;
}

export interface AddressForm {
  readonly street: FormControl<string | null>;
  readonly houseNumber: FormControl<string | null>;
  readonly apartmentNumber: FormControl<string | null>;
  readonly postalCode: FormControl<string | null>;
  readonly city: FormControl<string | null>;
  readonly country: FormControl<string | null>;
}

export interface AchievementForm {
  readonly name: FormControl<string | null>;
  readonly date: FormControl<string | null>;
  readonly description: FormControl<string | null>;
}

interface ApiError {
  readonly status: number;
  readonly error: {
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
    MatDatepickerModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
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
  protected countries: Country[] = [];
  protected filteredCountries: Observable<Country[]>;
  protected errorMessage: string | null = null;

  public constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private clubService: ClubService,
    private countryService: CountryService,
    private location: Location,
    private toastService: ToastService,
    private clubFormService: ClubFormService
  ) {
    this.clubForm = this.clubFormService.createClubForm();

    this.filteredCountries = this.clubForm.get('address.country')!.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value) => this.filterCountries(value ?? ''))
    );
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
            this.clubFormService.getAchievementsFormArray(this.clubForm).push(new FormGroup<AchievementForm>({
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

    this.clubForm.get('foundedYear')?.valueChanges.subscribe(() => {
      this.clubFormService.initializeAchievementDateValidator(this.clubForm);
    });
  }

  protected filterCountries(value: string): Observable<Country[]> {
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
        this.toastService.showToast("Club added successfully!");
        this.router.navigate([`/club/${club.clubId}/main`]);
      },
      error: (error: ApiError) => {
        if (error.status === 400) {
          this.errorMessage = error.error.message || "Single user must have maximum 4 clubs.";
          this.toastService.showToast(this.errorMessage);
        } 
        else if (error.status === 409) {
          this.errorMessage = error.error.message || "Club name exists in database.";
          this.toastService.showToast(this.errorMessage);
        } else {
          console.error("An error occurred:", error);
          this.errorMessage = "An error occurred while adding the club. Please try again.";
          this.toastService.showToast(this.errorMessage);
        }
      },
    });
  }

  private updateClub(club: Club): void {
    this.clubService.updateClub(club).subscribe({
      next: () => {
        this.toastService.showToast("Club updated successfully!");
        this.router.navigate([`/club/${club.clubId}/main`]);
      },
      error: (error: ApiError) => {
        if (error.status === 404) {
          this.errorMessage = error.error.message || "Club not found.";
          this.toastService.showToast(this.errorMessage);
        } 
        else if (error.status === 409) {
          this.errorMessage = error.error.message || "Club name exists in database.";
          this.toastService.showToast(this.errorMessage);
        }
        else {
          console.error("An error occurred:", error);
          this.errorMessage = "An error occurred while updating the club. Please try again.";
          this.toastService.showToast(this.errorMessage);
        }
      },
    });
  }

  protected goBack(): void {
    this.location.back();
  }

  protected addAchievement(): void {
    this.clubFormService.addAchievement(this.clubForm);
  }

  protected deleteAchievement(index: number): void {
    this.clubFormService.deleteAchievement(this.clubForm, index);
  }

  protected get achievements(): FormArray<FormGroup<AchievementForm>> {
    return this.clubFormService.getAchievementsFormArray(this.clubForm);
  }
}
