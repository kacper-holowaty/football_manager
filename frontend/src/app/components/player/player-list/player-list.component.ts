import { Component, OnInit } from '@angular/core';
import { Player } from '../../../models/player.model';
import { Router } from '@angular/router';
import { PlayerService } from '../../../services/player.service';
import { CalculateAgePipe } from '../../../pipes/calculate-age.pipe';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CalculateAgePipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent implements OnInit {
  protected players: Player[] = [];
  protected defaultPhotoUrl: string = 'assets/no_photo.png';
  protected apiUrl: string = "http://localhost:3000";

  public constructor(private playerService: PlayerService, private router: Router) {}

  public ngOnInit(): void {
    this.playerService.getPlayers().subscribe((players: Player[]) => {
      this.players = players;
    });
  }

  protected viewPlayerDetails(playerId: string): void {
    this.router.navigate([`/player/${playerId}/details`]);
  }

  protected addPlayer(): void {
    this.router.navigate(['/player/form']);
  }
}
