import { Component } from '@angular/core';
import { FormControl, FormGroup, NgSelectOption, ReactiveFormsModule, Validators } from '@angular/forms';
import { Player } from '../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { v4 as uuidv4 } from 'uuid';
import { DateValidators } from './date-validators';
import { CountryService } from '../../services/country.service';
import { Country } from '../../models/country.model';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectComponent],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.scss'
})
export class PlayerFormComponent {
  playerForm: FormGroup;
  player?: Player;
  editing: boolean = false;
  countries: Country[] = []; 

  positionOptions = [
    { label: 'Forward', value: 'forward' },
    { label: 'Midfielder', value: 'midfielder' },
    { label: 'Defender', value: 'defender' },
    { label: 'Goalkeeper', value: 'goalkeeper' },
  ];

  todayDate(): string {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
  
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  }

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService) {
    this.playerForm = new FormGroup({
      photo: new FormControl(null),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(32),
      ]),
      birthDate: new FormControl('', [
        Validators.required,
        DateValidators.birthDateValidator(),
      ]),
      nationality: new FormControl('', Validators.required),
      position: new FormControl('', Validators.required),
      shirtNumber: new FormControl('', [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
      ]),
      contractUntil: new FormControl('', [
        Validators.required,
        DateValidators.contractDateValidator(),
      ]),
      salary: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(5000000)
      ]),
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editing = true;
      this.playerService.getPlayerById(id).subscribe((player: Player) => {
        this.player = player;
        this.playerForm.patchValue({
          photo: player.photo,
          birthDate: player.birthDate,
          nationality: player.nationality,
          position: player.position,
          shirtNumber: player.shirtNumber,
          firstName: player.firstName,
          lastName: player.lastName,
          contractUntil: player.contractUntil,
          salary: player.salary,
        });
      });
    }


    this.countryService.getCountries().subscribe(countries => {
      this.countries = countries;
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.playerForm.patchValue({ photo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.value;
      const player: Player = {
        id: this.player ? this.player.id : uuidv4(),
        photo: formValue.photo,
        birthDate: formValue.birthDate,
        nationality: formValue.nationality,
        position: formValue.position,
        shirtNumber: formValue.shirtNumber,
        firstName: formValue.firstName,
        lastName: formValue.lastName,
        contractUntil: formValue.contractUntil,
        salary: formValue.salary,
      };

      if (this.editing) {
        this.playerService.updatePlayer(player).subscribe(() => {
          console.log("Player updated successfully!");
          this.router.navigate(['/player/list']);
        });
      } else {
        this.playerService.addPlayer(player).subscribe(() => {
          console.log("Player added succesfully!");
          this.router.navigate(['/player/list']);
        });
      }
    }
  }

}

