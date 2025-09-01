import { Component, OnDestroy, OnInit } from '@angular/core';
import { ClubFormService } from '../../../services/club-form.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Club, ClubRequest, UpdateClubRequest } from '../../../models/club.model';
import { Country } from '../../../models/country.model';
import { ClubForm } from '../../../models/club-form.model';
import { CountryService } from '../../../services/country.service';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, Observable, startWith, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { ClubService } from '../../../services/club.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Location } from '@angular/common';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';
 
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
      switchMap((value) => this.clubFormService.filterCountries(value ?? ''))
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
        if (club.badgeUrl) {
          this.badgePreviewUrl = club.badgeUrl;
          this.clubService.getClubBadgeAsBlob(club.clubId).subscribe({
            next: (blob) => {
              this.clubForm.get('badge')?.setValue(blob);
            },
            error: (err) => console.error('Error fetching badge as blob:', err)
          });
        }
      });
    }

    this.countryService.getCountries().subscribe({
      next: (countries) => this.countries = countries,
      error: (err) => console.error('Error fetching countries:', err)
    });

    this.isUserLoggedIn = this.authService.isAuthenticated();

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }

  protected badgePreviewUrl: string | null = null;
  protected badgeRemoved = false;

  protected onBadgeSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
  
    if (input.files) {
      const file = input.files[0];
  
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

    const formValue: Partial<ClubForm> = this.clubFormService.mapFormValue(this.clubForm);
    if (this.editing) {
      const clubUpdateRequest = this.clubFormService.updateClubRequest(formValue, this.clubForm, this.currentUserId);
      this.updateClub(clubUpdateRequest);
    } else {
      const clubRequest = this.clubFormService.createClubRequest(formValue, this.currentUserId);
      this.addClub(clubRequest);
    }
  }

  private addClub(clubRequest: ClubRequest): void {
    this.clubFormService.addClub(clubRequest).subscribe({
      next: (createdClub: Club) => {
        this.toastService.showToast("Club added successfully!");
        this.router.navigate([`/club/${createdClub.clubId}/main`]);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          this.errorMessage = (error.error as { message: string }).message;
        } else {
          this.errorMessage = "An error occurred while adding the club.";
        }
        this.toastService.showToast(this.errorMessage);
      },
    });
  }
  
  private updateClub(club: UpdateClubRequest): void {
    if (this.badgeRemoved) {
      this.clubFormService.removeClubBadge(this.club!.clubId).subscribe({
        next: () => {
          this.clubFormService.updateClub(this.club!.clubId, club).subscribe({
            next: () => {
              this.toastService.showToast("Club updated successfully!");
              this.router.navigate([`/club/${this.club!.clubId}/main`]);
            },
            error: (error: HttpErrorResponse) => {
              if (error.error && typeof error.error === 'object' && 'message' in error.error) {
                this.errorMessage = (error.error as { message: string }).message;
              } else {
                this.errorMessage = "An error occurred while updating the club.";
              }
              this.toastService.showToast(this.errorMessage);
            },
          });
        },
        error: (error) => {
          console.error("Error removing badge:", error);
          this.toastService.showToast("Error removing badge.");
        }
      });
    } else {
      this.clubFormService.updateClub(this.club!.clubId, club).subscribe({
        next: () => {
          this.toastService.showToast("Club updated successfully!");
          this.router.navigate([`/club/${this.club!.clubId}/main`]);
        },
        error: (error: HttpErrorResponse) => {
          if (error.error && typeof error.error === 'object' && 'message' in error.error) {
            this.errorMessage = (error.error as { message: string }).message;
          } else {
            this.errorMessage = "An error occurred while updating the club.";
          }
          this.toastService.showToast(this.errorMessage);
        },
      });
    }
  }

  protected goBack(): void {
    this.location.back();
  }
}
