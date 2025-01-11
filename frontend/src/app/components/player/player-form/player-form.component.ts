import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { v4 as uuidv4 } from 'uuid';
import { DateValidators } from './date-validators';
import { CountryService } from '../../../services/country.service';
import { Country } from '../../../models/country.model';

export interface PlayerForm {
  photo: FormControl<Blob | null>;
  name: FormControl<string | null>;
  birthDate: FormControl<Date | null>;
  nationality: FormControl<string | null>;
  position: FormControl<string | null>;
  shirtNumber: FormControl<number | null>;
  contractUntil: FormControl<Date | null>;
  salary: FormControl<number | null>;
}

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent implements OnInit, OnDestroy {
  protected playerForm: FormGroup<PlayerForm>;
  protected player?: Player;
  protected editing: boolean = false;
  protected countries: Country[] = []; 

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

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService) {
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
  }

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('playerId');
    if (id) {
      this.editing = true;
      this.playerService.getPlayerById(id).subscribe((player: Player) => {
        this.player = player;
        this.playerForm.patchValue({
          photo: player.photo,
          name: player.name,
          birthDate: player.birthDate,
          nationality: player.nationality,
          position: player.position,
          shirtNumber: player.shirtNumber,
          contractUntil: player.contractUntil,
          salary: player.salary,
        });
      });
    }

    this.countryService.getCountries().subscribe((countries) => {
      this.countries = countries;
    });
  }

  protected photoPreviewUrl: string | null = null;

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
  
  private handleImageFile(file: File): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
    this.photoPreviewUrl = URL.createObjectURL(file);

    this.playerForm.get('photo')?.setValue(file);
  }

  protected removePhoto(): void {
    this.photoPreviewUrl = null;
    this.playerForm.get('photo')?.setValue(null);
    const inputFile = document.getElementById('photo') as HTMLInputElement;
    inputFile.value = '';
  }

  public ngOnDestroy(): void {
    if (this.photoPreviewUrl) {
      URL.revokeObjectURL(this.photoPreviewUrl);
    }
  }

  // protected onSubmit(): void {
  //   const clubId = this.route.snapshot.paramMap.get('id');
    
  //   if (this.playerForm.valid && clubId) {
  //     const player = this.createPlayerFromForm(clubId);
  
  //     if (this.editing) {
  //       this.updatePlayer(player, clubId);
  //     } else {
  //       this.addPlayer(player, clubId);
  //     }
  //   }
  // }
  
  // private createPlayerFromForm(clubId: string): Player {
  //   const formValue = this.playerForm.value;
  //   return {
  //     id: this.player ? this.player.id : uuidv4(),
  //     photo: formValue.photo ?? null,
  //     name: formValue.name ?? '',
  //     birthDate: formValue.birthDate ?? new Date(),
  //     nationality: formValue.nationality ?? '',
  //     position: formValue.position ?? '',
  //     shirtNumber: formValue.shirtNumber ?? 0,
  //     contractUntil: formValue.contractUntil ?? new Date(),
  //     salary: formValue.salary ?? 0,
  //     clubId: clubId,
  //   };
  // }
  
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
      birthDate: this.playerForm.get('birthDate') as FormControl<Date | null> | undefined,
      nationality: this.playerForm.get('nationality') as FormControl<string | null> | undefined,
      position: this.playerForm.get('position') as FormControl<string | null> | undefined,
      shirtNumber: this.playerForm.get('shirtNumber') as FormControl<number | null> | undefined,
      contractUntil: this.playerForm.get('contractUntil') as FormControl<Date | null> | undefined,
      salary: this.playerForm.get('salary') as FormControl<number | null> | undefined,
    };
  }
  
  private createPlayer(formValue: Partial<PlayerForm>): Player {
    const clubId = this.route.snapshot.paramMap.get('id');

    return {
      playerId: this.player ? this.player.playerId : uuidv4(),
      photo: this.extractValue(formValue.photo, null),
      name: this.extractValue(formValue.name, ''),
      birthDate: this.extractValue(formValue.birthDate, new Date()),
      nationality: this.extractValue(formValue.nationality, ''),
      position: this.extractValue(formValue.position, ''),
      shirtNumber: this.extractValue(formValue.shirtNumber, 0),
      contractUntil: this.extractValue(formValue.contractUntil, new Date()),
      salary: this.extractValue(formValue.salary, 0),
      clubId: clubId ?? '',
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

