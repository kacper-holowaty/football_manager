import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../../models/player.model';
// import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { NumberWithSpacesPipe } from '../../../pipes/number-with-spaces.pipe';
import { CountryService } from '../../../services/country.service';
import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CalculateAgePipe, ContractLeftPipe, FormatDatePipe, NumberWithSpacesPipe],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  protected player?: Player;
  protected defaultPhotoUrl: string = 'assets/images/no_photo.png';
  protected countryCode: string = '';
  protected currentUserId: string = '';
  protected isUserLoggedIn: boolean = false;

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router, private countryService: CountryService, private authService: AuthService) {}

  public ngOnInit(): void {
    const playerId = this.route.snapshot.paramMap.get('playerId');
    if (playerId) {
      this.playerService.getPlayerById(playerId).subscribe((player: Player) => {
        this.player = player;
        this.countryService.getCountryCode(player.nationality).subscribe((result) => {
          this.countryCode = result.code;
        });
      });
    }

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
    });

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }
  
  protected deletePlayer(playerId: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(playerId).subscribe(() => {
        this.router.navigate([`club/${this.player?.clubId}/player/list`]);
        console.log('Player deleted successfully');
      });
    }
  }

  protected editPlayer(playerId: string): void {
    this.router.navigate([`club/${this.player?.clubId}/player/${playerId}/form`]);
  }
}
