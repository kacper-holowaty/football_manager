import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Club } from '../../../models/club.model';
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

export interface ClubForm {
  name: FormControl<string | null>;
  badge: FormControl<File | null>;
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
  date: FormControl<Date | null>;
  description: FormControl<string | null>;
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
export class ClubFormComponent implements OnInit{
  isUserLoggedIn: boolean = false;
  currentUserId: string = '';
  club?: Club;
  clubForm: FormGroup<ClubForm>;
  editing: boolean = false;
  currentYear = new Date().getFullYear();
  countries: Country[] = [];
  filteredCountries: Observable<Country[]>;
  
  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router, private countryService: CountryService) {
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
          [allowedCountriesAsyncValidator(this.countryService)
        ]),
      }),
      achievements: new FormArray<FormGroup<AchievementForm>>([]),
    });

    this.filteredCountries = this.clubForm.get('address.country')!.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap(value => this.filterCountries(value ?? ''))
    );
  }

  addAchievement(): void {
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
  }

  deleteAchievement(index: number): void {
    this.clubForm.controls.achievements.removeAt(index);
  }

  get achievements() {
    return this.clubForm.controls.achievements as FormArray<FormGroup<AchievementForm>>;
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      // this.clubService.getClubById(id).subscribe((club: Club) => {
      //   this.club = club;
      //   this.clubForm.patchValue({
      //     name: club.name,
      //     badge: club.badge,
      //     foundedYear: club.foundedYear,
      //     stadiumName: club.stadiumName,
      //     stadiumCapacity: club.stadiumCapacity,
      //     address: {
      //       street: club.address.street,
      //       houseNumber: club.address.houseNumber,
      //       apartmentNumber: club.address.apartmentNumber,
      //       postalCode: club.address.postalCode,
      //       city: club.address.city,
      //       country: club.address.country,
      //     },
      //   });

      //   if (club.achievements && club.achievements.length > 0) {
      //     club.achievements.forEach((achievement) => {
      //       this.achievements.push(new FormGroup<AchievementForm>({
      //         name: new FormControl(achievement.name, Validators.required),
      //         date: new FormControl(achievement.date, Validators.required),
      //         description: new FormControl(achievement.description, Validators.required),
      //       }));
      //     });
      //   }
      // });
    }    

    this.countryService.getCountries().subscribe({
      next: (countries) => this.countries = countries,
      error: (err) => console.error('Error fetching countries:', err)
    });

    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isUserLoggedIn = isAuthenticated;
    });

    this.authService.getAuthenticatedUserId().subscribe(userId => {
      this.currentUserId = userId;
    })

    this.clubForm.get('foundedYear')?.valueChanges.subscribe((foundedYear) => {
      const achievementsArray = this.clubForm.get('achievements') as FormArray;
      achievementsArray.controls.forEach((achievementGroup) => {
        const dateControl = achievementGroup.get('date');
        dateControl?.setValidators([achievementsDateValidator(foundedYear)]);
        dateControl?.updateValueAndValidity();
      });
    });
  }

  filterCountries(value: string): Observable<Country[]> {
    if (!value) {
      return of(this.countries);
    }
    const filterValue = value.toLowerCase();
    return this.countryService.getCountries().pipe(
      map(countries => countries.filter(country => country.country.toLowerCase().includes(filterValue)))
    );
  }

  badgePreviewUrl: string | null = null;

  onBadgeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files && input.files[0]) {
      const file = input.files[0];
      console.log('Selected file:', file);
  
      if (file.type.startsWith('image/')) {
        if (this.badgePreviewUrl) {
          URL.revokeObjectURL(this.badgePreviewUrl);
        }
        this.badgePreviewUrl = URL.createObjectURL(file);
  
        this.clubForm.get('badge')?.setValue(file);
      } else {
        console.error('Selected file is not an image.');
      }
    } else {
      console.log('No file selected.');
    }
  }
  
  removePhoto(): void {
    this.badgePreviewUrl = null;
    this.clubForm.get('badge')?.setValue(null);
    const inputFile = document.getElementById('badge') as HTMLInputElement;
    if (inputFile) {
      inputFile.value = '';
    }
  }

  ngOnDestroy(): void {
    if (this.badgePreviewUrl) {
      URL.revokeObjectURL(this.badgePreviewUrl);
    }
  }

  onSubmit() {
    if (this.clubForm.valid) {
      const formValue = this.clubForm.value;
      const club: Club = {
        id: this.club ? this.club.id : uuidv4(),
        name: formValue.name ?? '',
        badge: formValue.badge || null,
        ownerId: this.currentUserId,
        foundedYear: formValue.foundedYear ?? 0,
        stadiumName: formValue.stadiumName ?? '',
        stadiumCapacity: formValue.stadiumCapacity ?? 0,
        address: {
          street: formValue.address?.street ?? '',
          houseNumber: formValue.address?.houseNumber ?? '',
          apartmentNumber: formValue.address?.apartmentNumber ?? '',
          postalCode: formValue.address?.postalCode ?? '',
          city: formValue.address?.city ?? '',
          country: formValue.address?.country ?? '',
        },
        achievements: (formValue.achievements ?? []).map((achievementForm) => ({
          name: achievementForm.name ?? '',
          date: achievementForm.date ?? new Date(),
          description: achievementForm.description ?? '',
        })),
      };
      console.log("Club added successfully!");
      this.router.navigate([`/club/${club.id}/main`])
      
      // if (this.editing) {
      //   this.clubService.updateClub(club).subscribe(() => {
      //     console.log("Club updated successfully!");
      //     this.router.navigate([`/club/${id}/`]);
      //   });
      // } else {
      //   this.clubService.addClub(club).subscribe(() => {
      //     console.log("Club added succesfully!");
      //     this.router.navigate([`/club/${club.id}/main`]);
      //   });
      // }
    }
  }
}
