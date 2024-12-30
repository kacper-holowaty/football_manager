import { Component } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../models/player.model';
import { ContractLeftPipe } from '../../pipes/contract-left.pipe';
import { CalculateAgePipe } from '../../pipes/calculate-age.pipe';
import { FormatDatePipe } from '../../pipes/format-date.pipe';
import { NumberWithSpacesPipe } from '../../pipes/number-with-spaces.pipe';

@Component({
  selector: 'app-player-details',
  standalone: true,
  imports: [ContractLeftPipe, CalculateAgePipe, FormatDatePipe, NumberWithSpacesPipe],
  templateUrl: './player-details.component.html',
  styleUrl: './player-details.component.scss'
})
export class PlayerDetailsComponent {
  player?: Player;
  defaultPhotoUrl: string = 'assets/no_photo.png';
  apiUrl: string = "http://localhost:3000"

  constructor(private route: ActivatedRoute, private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.playerService.getPlayerById(id).subscribe((player: Player) => {
        this.player = player;
      });
    }
  }

  getPhotoUrl(photo?: File): string {
    // photo jest typu string, wymaga poprawki albo zmiany typu photo w interfejsie Player
    if (photo) {
      // return URL.createObjectURL(photo);
      const photoPath = `${this.apiUrl}${photo}`
      return photoPath;
    } else {
      return this.defaultPhotoUrl;
    }
  }
  
  deletePlayer(id: string): void {
    if (confirm('Are you sure you want to delete this player?')) {
      this.playerService.deletePlayer(id).subscribe(() => {
        this.router.navigate(['/player/list']);
        console.log('Player deleted successfully');
      });
    }
  }

  editPlayer(id: string): void {
    this.router.navigate([`/player/${id}/form`]);
  }
}
