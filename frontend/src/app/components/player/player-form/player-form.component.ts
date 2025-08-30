import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player, PlayerRequest } from '../../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { DateValidators } from './date-validators';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country.model';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { debounceTime, map, Observable, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { allowedCountriesAsyncValidator } from '../../club/club-form/validators';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface PlayerForm {
  readonly photo: FormControl<Blob | null>;
  readonly name: FormControl<string | null>;
  readonly birthDate: FormControl<string | null>;
  readonly nationality: FormControl<string | null>;
  readonly positions: FormControl<string[] | null>;
  readonly shirtNumber: FormControl<number | null>;
  readonly contractUntil: FormControl<string | null>;
  readonly salary: FormControl<number | null>;
}

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    AsyncPipe
  ],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit, OnDestroy {
  protected isUserLoggedIn: boolean = false;
  protected currentUserId: string = '';
  protected playerForm: FormGroup<PlayerForm>;
  protected player?: Player;
  protected editing: boolean = false;
  protected countries: Country[] = [];
  protected filteredCountries: Observable<Country[]>; 
  protected errorMessage: string = '';

  protected positionOptions = ["GK", "CB", "LB", "RB", "CDM", "CM", "CAM", "LM", "RM", "LW", "RW", "CF", "ST"];

  protected todayDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
  
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService, private authService: AuthService, private toastService: ToastService) {
    this.playerForm = new FormGroup<PlayerForm>({
      photo: new FormControl(null),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(45),
      ]),
      birthDate: new FormControl(null, [
        Validators.required,
        DateValidators.birthDateValidator(),
      ]),
      nationality: new FormControl('', Validators.required, [allowedCountriesAsyncValidator(this.countryService)]),
      positions: new FormControl([] as string[], [Validators.required, Validators.maxLength(3)]),
      shirtNumber: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
      ]),
      contractUntil: new FormControl(null, [
        Validators.required,
        DateValidators.contractDateValidator(),
      ]),
      salary: new FormControl(null, [
        Validators.required,
        Validators.min(0),
        Validators.max(5000000)
      ]),
    });

    this.filteredCountries = this.playerForm.get('nationality')!.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value) => this.filterCountries(value ?? ''))
    );
  }

  protected filterCountries(value: string): Observable<Country[]> {
    const filterValue = value.toLowerCase();
  
    return this.countryService.getCountries().pipe(
      map((countries) => countries.filter((country) => country.country.toLowerCase().includes(filterValue)))
    );
  }

  public ngOnInit(): void {
    const clubId = this.route.snapshot.paramMap.get('id');
    const playerId = this.route.snapshot.paramMap.get('playerId');
    if (clubId && playerId) {
      this.editing = true;
      
      this.playerService.getPlayerById(clubId, playerId).subscribe((player: Player) => {
        this.player = player;
        const formattedBirthDate = new Date(player.birthDate).toISOString().split('T')[0];
        const formattedContractUntil = new Date(player.contractUntil).toISOString().split('T')[0];
        this.playerForm.patchValue({
          name: player.name,
          birthDate: formattedBirthDate,
          nationality: player.nationality,
          positions: player.positions,
          shirtNumber: player.shirtNumber,
          contractUntil: formattedContractUntil,
          salary: player.salary,
        });
        if (player.photoUrl) {
          this.photoPreviewUrl = player.photoUrl;
          this.playerService.getPlayerPhotoAsBlob(player.clubId, player.playerId).subscribe({
            next: (blob) => {
              this.playerForm.get('photo')?.setValue(blob);
            },
            error: (err) => console.error('Error fetching photo as blob:', err)
          });
        }
      });
    }

    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    this.isUserLoggedIn = this.authService.isAuthenticated();

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }

  protected photoPreviewUrl: string | null = null;
  protected photoRemoved = false;

  protected onPhotoSelected(event: Event): void {
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
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.photoPreviewUrl = URL.createObjectURL(file);
    this.playerForm.get('photo')?.setValue(file);
  }
  
  protected removePhoto(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.photoPreviewUrl = null;
    this.playerForm.get('photo')?.setValue(null);
    this.photoRemoved = true;
    const inputFile = document.getElementById('photo') as HTMLInputElement;
    inputFile.value = '';
  }

  public ngOnDestroy(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
  }
  
  protected onSubmit(): void {
    if (!this.playerForm.valid) {
      return;
    }
  
    const formValue: Partial<PlayerForm> = this.mapFormValue();
    const player = this.createPlayer(formValue);
  
    if (this.editing) {
      this.updatePlayer(player);
    } else {
      this.addPlayer(player);
    }
  }
  
  private mapFormValue(): Partial<PlayerForm> {
    return {
      photo: this.playerForm.get('photo') as FormControl<Blob | null> | undefined,
      name: this.playerForm.get('name') as FormControl<string | null> | undefined,
      birthDate: this.playerForm.get('birthDate') as FormControl<string | null> | undefined,
      nationality: this.playerForm.get('nationality') as FormControl<string | null> | undefined,
      positions: this.playerForm.get('positions') as FormControl<string[] | null> | undefined,
      shirtNumber: this.playerForm.get('shirtNumber') as FormControl<number | null> | undefined,
      contractUntil: this.playerForm.get('contractUntil') as FormControl<string | null> | undefined,
      salary: this.playerForm.get('salary') as FormControl<number | null> | undefined,
    };
  }
  
  private createPlayer(formValue: Partial<PlayerForm>): PlayerRequest {
    const clubId = this.route.snapshot.paramMap.get('id');

    return {
      photo: this.playerForm.get('photo')?.value ?? null,
      name: this.extractValue(formValue.name, ''),
      birthDate: formValue.birthDate?.value ? this.formatDateToYearMonthDay(new Date(formValue.birthDate.value)) : this.formatDateToYearMonthDay(new Date()),
      nationality: this.extractValue(formValue.nationality, ''),
      positions: this.extractValue(formValue.positions, []),
      shirtNumber: this.extractValue(formValue.shirtNumber, 0),
      contractUntil: formValue.contractUntil?.value ? this.formatDateToYearMonthDay(new Date(formValue.contractUntil.value)) : this.formatDateToYearMonthDay(new Date()),
      salary: this.extractValue(formValue.salary, 0),
      clubId: clubId ?? '',
    };
  }
  
  private extractValue<T>(control: FormControl<T | null> | undefined, defaultValue: T): T {
    return control?.value ?? defaultValue;
  }
  
  private updatePlayer(player: PlayerRequest): void {
    if (this.photoRemoved) {
      this.playerService.removePlayerPhoto(this.player!.clubId, this.player!.playerId).subscribe({
        next: () => {
          this.updatePlayerDetails(player);
        },
        error: (error) => {
          console.error("Error removing photo:", error);
          this.toastService.showToast("Error removing photo.");
        }
      });
    } else {
      this.updatePlayerDetails(player);
    }
  }

  private updatePlayerDetails(player: PlayerRequest): void {
    this.playerService.updatePlayer(this.player!.playerId, player).subscribe({
      next: () => {
        this.toastService.showToast("Player updated successfully!");
        this.router.navigate([`/club/${player.clubId}/player/list`]);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          this.errorMessage = (error.error as { message: string }).message;
        } else {
          this.errorMessage = "An error occurred while updating the player. Please try again.";
        }
        this.toastService.showToast(this.errorMessage);
      },
    });
  }

  private addPlayer(player: PlayerRequest): void {
    this.playerService.addPlayer(player).subscribe({
      next: () => {
        this.toastService.showToast("Player added successfully!");
        this.router.navigate([`/club/${player.clubId}/player/list`]);
      },
      error: (error: HttpErrorResponse) => {
        if (error.error && typeof error.error === 'object' && 'message' in error.error) {
          this.errorMessage = (error.error as { message: string }).message;
        } else {
          this.errorMessage = "An error occurred while adding the player. Please try again.";
        }
        this.toastService.showToast(this.errorMessage);
      },
    });
  }
  private formatDateToYearMonthDay(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

