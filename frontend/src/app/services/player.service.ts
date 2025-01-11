import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/api/players';

  public constructor(private http: HttpClient) {}

  public getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  public getPlayerById(id: string): Observable<Player> {
    return this.http.get<Player>(`${this.apiUrl}/${id}`);
  }

  public addPlayer(player: Player): Observable<Player> {
    const formData = new FormData();
    formData.append("id", player.playerId);
    formData.append("name", player.name);
    formData.append("birthDate", new Date(player.birthDate).toISOString());
    formData.append("nationality", player.nationality);
    formData.append("position", player.position);
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", new Date(player.contractUntil).toISOString());
    formData.append("salary", player.salary.toString());
  
    if (player.photo) {
      formData.append("photo", player.photo);
    }
  
    return this.http.post<Player>(this.apiUrl, formData);
  }

  public updatePlayer(player: Player): Observable<Player> {
    const formData = new FormData();
    formData.append("id", player.playerId);
    formData.append("name", player.name);
    formData.append("birthDate", new Date(player.birthDate).toISOString());
    formData.append("nationality", player.nationality);
    formData.append("position", player.position);
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", new Date(player.contractUntil).toISOString());
    formData.append("salary", player.salary.toString());
  
    if (player.photo) {
      formData.append("photo", player.photo);
    }
  
    return this.http.put<Player>(`${this.apiUrl}/${player.playerId}`, formData);
  }
  
  public deletePlayer(playerId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${playerId}`);
  }
}