import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../../services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../../models/player.model';
// import { ContractLeftPipe } from '../../../pipes/contract-left.pipe';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';
import { FormatDatePipe } from '../../../pipes/format-date.pipe';
import { NumberWithSpacesPipe } from '../../../pipes/number-with-spaces.pipe';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [CalculateAgePipe, FormatDatePipe, NumberWithSpacesPipe],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent implements OnInit {
  protected player?: Player;
  protected defaultPhotoUrl: string = 'assets/no_photo.png';
  protected apiUrl: string = "http://localhost:3000";

  public constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.playerService.getPlayerById(id).subscribe((player: Player) => {
        this.player = player;
      });
    }
  }

  protected getPhotoUrl(photo: Blob | null): string {
    if (photo) {
      const photoPath = `${this.apiUrl}${photo}`;

      return photoPath;
    } 

    return this.defaultPhotoUrl;
  }
  
  protected deletePlayer(id: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id).subscribe(() => {
        this.router.navigate(['/player/list']);
        console.log('Player deleted successfully');
      });
    }
  }

  protected editPlayer(id: string): void {
    this.router.navigate([`/player/${id}/form`]);
  }
}
