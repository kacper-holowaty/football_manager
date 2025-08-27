import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../../models/player.model';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { NumberWithSpacesPipe } from '../../../pipes/number-with-spaces.pipe';
import { CountryService } from '../../../services/country.service';
import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { AuthService } from '../../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../../services/toast.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeletePlayerDialogComponent } from './delete-player-dialog/delete-player-dialog.component';
import { ClubService } from '../../../services/club.service';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [
    CalculateAgePipe,
    ContractLeftPipe, 
    FormatDatePipe, 
    NumberWithSpacesPipe,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  protected player?: Player;
  protected defaultPhotoUrl: string = 'assets/images/no_photo.png';
  protected countryCode: string = '';
  protected currentUserId: string = '';
  protected isUserLoggedIn: boolean = false;
  protected clubOwnerId: string = '';

  public constructor(
    private route: ActivatedRoute, 
    private playerService: PlayerService, 
    private router: Router, 
    private countryService: CountryService, 
    private authService: AuthService, 
    private dialog: MatDialog, 
    private toastService: ToastService,
    private clubService: ClubService
  ) {}

  public ngOnInit(): void {
    const clubId = this.route.snapshot.paramMap.get('id');
    const playerId = this.route.snapshot.paramMap.get('playerId');
    if (clubId && playerId) {
      this.playerService.getPlayerById(clubId, playerId).subscribe((player: Player) => {
        this.player = player;
        this.countryService.getCountryCode(player.nationality).subscribe((result) => {
          this.countryCode = result.code;
        });
      });

      this.clubService.getClubById(clubId).subscribe((club) => {
        this.clubOwnerId = club.ownerId;
      });
    }

    this.isUserLoggedIn = this.authService.isAuthenticated();

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }

  public openDeletePlayerConfirmationDialog(playerId: string): void {
    const dialogRef = this.dialog.open(DeletePlayerDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deletePlayer(playerId);
      }
    });
  }
  
  protected deletePlayer(playerId: string): void {
    this.playerService.deletePlayer(this.player!.clubId, playerId).subscribe(() => {
      this.toastService.showToast('Player deleted successfully!');
      this.router.navigate([`club/${this.player?.clubId}/player/list`]);
    });
  }

  protected editPlayer(playerId: string): void {
    this.router.navigate([`club/${this.player?.clubId}/player/${playerId}/form`]);
  }
}
