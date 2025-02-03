import { Component, OnInit } from '@angular/core';
import { Player } from '../../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';
import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CalculateAgePipe, ContractLeftPipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements OnInit {
  protected players: Player[] = [];
  protected defaultPhotoUrl: string = 'assets/no_photo.png';
  protected apiUrl: string = "http://localhost:3000";
  protected clubId: string | null = '';
  protected countryCodes: Record<string, string> = {};

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService) {}

  public ngOnInit(): void {
    this.clubId = this.route.snapshot.paramMap.get('id');
    if (this.clubId) {
      this.playerService.getPlayersByClub(this.clubId).subscribe((players: Player[]) => {
        this.players = players;
        if (this.players.length > 0) {
          this.loadCountryFlags(this.players);
        }
      });
    }
  }

  protected viewPlayerDetails(playerId: string): void {
    this.router.navigate([`club/${this.clubId}/player/${playerId}/details`]);
  }

  protected addPlayer(): void {
    this.router.navigate([`club/${this.clubId}/player/form`]);
  }

  private loadCountryFlags(players: Player[]): void {
    const countries = players.map((player) => player.nationality);
    this.countryService.getCountryCodes(countries).subscribe({
      next: (codes) => {
        codes.forEach((code) => {
          this.countryCodes[code.country] = code.code;
        });
      },
      error: (err) => {
        console.error('Error fetching country codes', err);
      }
    });
  }
  
  protected getCountryCode(country: string): string {
    return this.countryCodes[country] || '';
  }
}
