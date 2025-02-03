import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:3000/players';

  public constructor(private httpClient: HttpClient) {}

  public getPlayersByClub(clubId: string): Observable<Player[]> {
    return this.httpClient.get<Player[]>(`${this.apiUrl}/club/${clubId}`);
  }

  public getPlayerById(id: string): Observable<Player> {
    return this.httpClient.get<Player>(`${this.apiUrl}/${id}`);
  }

  public addPlayer(player: Player): Observable<Player> {
    const formData = new FormData();
    formData.append("playerId", player.playerId);
    formData.append("name", player.name);
    formData.append("birthDate", new Date(player.birthDate).toISOString());
    formData.append("nationality", player.nationality);
    formData.append("position", player.position);
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", new Date(player.contractUntil).toISOString());
    formData.append("salary", player.salary.toString());
    formData.append("clubId", player.clubId);
    formData.append("clubOwnerId", player.clubOwnerId);
  
    if (player.photo) {
      formData.append("photo", player.photo);
    }
  
    return this.httpClient.post<Player>(this.apiUrl, formData);
  }

  public updatePlayer(player: Player): Observable<Player> {
    const formData = new FormData();
    formData.append("playerId", player.playerId);
    formData.append("name", player.name);
    formData.append("birthDate", new Date(player.birthDate).toISOString());
    formData.append("nationality", player.nationality);
    formData.append("position", player.position);
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", new Date(player.contractUntil).toISOString());
    formData.append("salary", player.salary.toString());
    formData.append("clubId", player.clubId);
    formData.append("clubOwnerId", player.clubOwnerId);
  
    if (player.photo) {
      formData.append("photo", player.photo);
    }
  
    return this.httpClient.put<Player>(`${this.apiUrl}/${player.playerId}`, formData);
  }
  
  public deletePlayer(playerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${playerId}`);
  }
}