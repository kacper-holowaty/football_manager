import { Component, OnInit } from '@angular/core';
import { Player } from '../../../models/player.model';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';
import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { CountryService } from '../../../services/country.service';
import { ClubService } from '../../../services/club.service';
import { AuthService } from '../../../services/auth.service';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { Club } from '../../../models/club.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CalculateAgePipe, ContractLeftPipe, MatButtonToggleModule, MatIconModule, FormsModule],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements OnInit {
  protected players: Player[] = [];
  protected defaultPhotoUrl: string = 'assets/images/no_photo.png';
  protected apiUrl: string = "http://localhost:3000";
  protected clubId: string | null = '';
  protected countryCodes: Record<string, string> = {};
  protected isUserLoggedIn: boolean = false;
  protected currentUserId: string = '';
  protected isCurrentUserOwner: boolean = false;
  protected clubName: string = '';

  protected sortBy: 'contractUntil' | 'shirtNumber' | 'fullName' = 'shirtNumber';
  protected sortAscending: boolean = true; 

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService, private clubService: ClubService, private authService: AuthService) {}

  public ngOnInit(): void {
    this.clubId = this.route.snapshot.paramMap.get('id');
    if (this.clubId) {
      this.playerService.getPlayersByClub(this.clubId).subscribe({
        next: (players: Player[]) => {
          this.players = players;
          if (this.players.length > 0) {
            this.loadCountryFlags(this.players);
          }
          this.sortPlayers();
        },
        error: (error) => {
          console.error("Error while fetching players:", error);
        }
      });
    }

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
    });

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });

    if (this.clubId) {
      this.clubService.getClubById(this.clubId).subscribe((club: Club) => {
        this.isCurrentUserOwner = club.ownerId === this.currentUserId;
        this.clubName = club.name;
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

  protected sortPlayers(): void {
    this.players.sort((a, b) => {
      let valueA: string | number, valueB:  string | number;
      
      switch (this.sortBy) {
      case 'contractUntil':
        valueA = new Date(a.contractUntil).getTime();
        valueB = new Date(b.contractUntil).getTime();
        break;
      case 'fullName':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'shirtNumber':
      default:
        valueA = a.shirtNumber;
        valueB = b.shirtNumber;
        break;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return this.sortAscending ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }
  
      return this.sortAscending ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
    });
  }

  protected changeSortOrder(sortBy: 'contractUntil' | 'shirtNumber' | 'fullName'): void {
    if (this.sortBy === sortBy) {
      this.sortAscending = !this.sortAscending;
    } else {
      this.sortBy = sortBy;
      this.sortAscending = true;
    }
    this.sortPlayers();
  }
}
