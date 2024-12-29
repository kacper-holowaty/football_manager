import { Component } from '@angular/core';
import { Player } from '../../models/player.model';
import { Router } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { CalculateAgePipe } from '../../pipes/calculate-age.pipe';

@Component({
  selector: 'app-player-list',
  standalone: true,
  imports: [CalculateAgePipe],
  templateUrl: './player-list.component.html',
  styleUrl: './player-list.component.scss'
})
export class PlayerListComponent {
  players: Player[] = [];
  defaultPhotoUrl: string = 'assets/no_photo.png';

  constructor(private playerService: PlayerService, private router: Router) {}

  ngOnInit(): void {
    this.playerService.getPlayers().subscribe((players: Player[]) => {
      this.players = players;
    });
  }

  
  
  // getPhotoUrl(photo?: File): string {
  //   if (photo) {
  //     return URL.createObjectURL(photo);
  //   } else {
  //     return this.defaultPhotoUrl;
  //   }
  // }

  getPhotoUrl(photo?: File): string {

    console.log(photo);
    console.log("Photo type:" + typeof photo);
    
    if (photo instanceof File) {
      try {
        console.log("It works!");
                

        return URL.createObjectURL(photo);
      } catch (error) {
        console.error("Error creating object URL:", error);
        return this.defaultPhotoUrl;
      }
    }
    return this.defaultPhotoUrl;
  }

  // deletePlayer(id: string): void {
  //   if (confirm('Are you sure you want to delete this player?')) {
  //     this.playerService.deletePlayer(id).subscribe(() => {
  //       this.players = this.players.filter(player => player.id !== id);
  //       console.log('Player deleted successfully');
  //     });
  //   }
  // }

  // editPlayer(id: string): void {
  //   this.router.navigate([`/player/${id}/form`]);
  // }

  viewPlayerDetails(id: string): void {
    this.router.navigate([`/player/${id}/details`]);
  }

  addPlayer(): void {
    this.router.navigate(['/player/form']);
  }
}
