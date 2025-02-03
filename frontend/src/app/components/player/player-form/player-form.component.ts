import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { v4 as uuidv4 } from 'uuid';
import { DateValidators } from './date-validators';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country.model';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AsyncPipe } from '@angular/common';
import { debounceTime, map, Observable, of, startWith, switchMap } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

export interface PlayerForm {
  photo: FormControl<Blob | null>;
  name: FormControl<string | null>;
  birthDate: FormControl<string | null>;
  nationality: FormControl<string | null>;
  position: FormControl<string | null>;
  shirtNumber: FormControl<number | null>;
  contractUntil: FormControl<string | null>;
  salary: FormControl<number | null>;
}

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule,
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

  protected positionOptions = [
    { label: 'Forward', value: 'forward' },
    { label: 'Midfielder', value: 'midfielder' },
    { label: 'Defender', value: 'defender' },
    { label: 'Goalkeeper', value: 'goalkeeper' },
  ];

  protected todayDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
  
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService, private authService: AuthService) {
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
      nationality: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
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
    if (!value) {
      return of(this.countries);
    }
    const filterValue = value.toLowerCase();
  
    return this.countryService.getCountries().pipe(
      map((countries) => countries.filter((country) => country.country.toLowerCase().includes(filterValue)))
    );
  }
  

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('playerId');
    if (id) {
      this.editing = true;
      
      this.playerService.getPlayerById(id).subscribe((player: Player) => {
        this.player = player;
        const formattedBirthDate = new Date(player.birthDate).toISOString().split('T')[0];
        const formattedContractUntil = new Date(player.contractUntil).toISOString().split('T')[0];
        this.playerForm.patchValue({
          photo: player.photo,
          name: player.name,
          birthDate: formattedBirthDate,
          nationality: player.nationality,
          position: player.position,
          shirtNumber: player.shirtNumber,
          contractUntil: formattedContractUntil,
          salary: player.salary,
        });
      });
    }

    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
    });

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
      position: this.playerForm.get('position') as FormControl<string | null> | undefined,
      shirtNumber: this.playerForm.get('shirtNumber') as FormControl<number | null> | undefined,
      contractUntil: this.playerForm.get('contractUntil') as FormControl<string | null> | undefined,
      salary: this.playerForm.get('salary') as FormControl<number | null> | undefined,
    };
  }
  
  private createPlayer(formValue: Partial<PlayerForm>): Player {
    const clubId = this.route.snapshot.paramMap.get('id');

    return {
      playerId: this.player ? this.player.playerId : uuidv4(),
      photo: this.extractValue(formValue.photo, null),
      name: this.extractValue(formValue.name, ''),
      birthDate: formValue.birthDate?.value ? new Date(formValue.birthDate.value) : new Date(),
      nationality: this.extractValue(formValue.nationality, ''),
      position: this.extractValue(formValue.position, ''),
      shirtNumber: this.extractValue(formValue.shirtNumber, 0),
      contractUntil: formValue.contractUntil?.value ? new Date(formValue.contractUntil.value) : new Date(),
      salary: this.extractValue(formValue.salary, 0),
      clubId: clubId ?? '',
      clubOwnerId: this.currentUserId,
    };
  }
  
  private extractValue<T>(control: FormControl<T | null> | undefined, defaultValue: T): T {
    return control?.value ?? defaultValue;
  }
  
  private updatePlayer(player: Player): void {
    this.playerService.updatePlayer(player).subscribe(() => {
      console.log("Player updated successfully!");
      this.router.navigate([`/club/${player.clubId}/player/list`]);
    });
  }
  
  private addPlayer(player: Player): void {
    this.playerService.addPlayer(player).subscribe(() => {
      console.log("Player added successfully!");
      this.router.navigate([`/club/${player.clubId}/player/list`]);
    });
  }
}

