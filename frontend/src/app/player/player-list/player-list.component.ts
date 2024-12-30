import { Component } from '@angular/core';
import { Player } from '../../models/player.model';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { CalculateAgePipe } from '../../pipes/calculate-age.pipe';
import { ContractLeftPipe } from '../../pipes/contract-left.pipe';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CalculateAgePipe, ContractLeftPipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  players: Player[] = [];
  defaultPhotoUrl: string = 'assets/no_photo.png';
  apiUrl: string = "http://localhost:3000"

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((players: Player[]) => {
      this.players = players;
    });
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

  viewPlayerDetails(id: string): void {
    this.router.navigate([`/player/${id}/details`]);
  }

  addPlayer(): void {
    this.router.navigate(['/player/form']);
  }
}
