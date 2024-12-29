import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  constructor(private http: HttpClient) {}

  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  getPlayerById(id: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  addPlayer(player: Player): Observable<Player> {
    return this.http.post<Player>(this.apiUrl, player);
  }

  updatePlayer(player: Player): Observable<Player> {
    return this.http.put<Player>(`${this.apiUrl}/${player.id}`, player);
  }

  
  deletePlayer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }















//   private storageKey = 'players';

//   private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<Player[]>([]);
//   players$: Observable<Player[]> = this.playersSubject.asObservable();

//   constructor() {
//     this.loadPlayers();
//   }

//   private loadPlayers(): void {
//     const storedPlayers = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
//     this.playersSubject.next(storedPlayers);
//   }

//   private savePlayers(): void {
//     localStorage.setItem(this.storageKey, JSON.stringify(this.playersSubject.value));
//   }

//   getPlayers(): Observable<Player[]> {
//     return this.players$;
//   }

//   getPlayerById(id: string): Observable<Player> {
//     const player = this.playersSubject.value.find(p => p.id === id);
//     return new Observable<Player>(observer => {
//       if (player) {
//         observer.next(player);
//         observer.complete();
//       } else {
//         observer.error('Player not found');
//       }
//     });
//   }

//   addPlayer(player: Player): Observable<void> {
//     const updatedPlayers = [...this.playersSubject.value, player];
//     this.playersSubject.next(updatedPlayers);
//     this.savePlayers();
//     return new Observable<void>(observer => {
//       observer.next();
//       observer.complete();
//     });
//   }

//   updatePlayer(updatedPlayer: Player): Observable<void> {
//     const updatedPlayers = this.playersSubject.value.map(player =>
//       player.id === updatedPlayer.id ? updatedPlayer : player
//     );
//     this.playersSubject.next(updatedPlayers);
//     this.savePlayers();
//     return new Observable<void>(observer => {
//       observer.next();
//       observer.complete();
//     });
//   }

//   deletePlayer(id: string): Observable<void> {
//     const updatedPlayers = this.playersSubject.value.filter(player => player.id !== id);
//     this.playersSubject.next(updatedPlayers);
//     this.savePlayers();
//     return new Observable<void>(observer => {
//       observer.next();
//       observer.complete();
//     });
//   }

}
