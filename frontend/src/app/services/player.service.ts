import { Injectable } from '@angular/core';
import { Player } from '../models/player.model';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '../models/response.type';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private apiUrl = 'http://localhost:8080/api';

  public constructor(private httpClient: HttpClient) {}

  public getPlayersByClub(clubId: string): Observable<Player[]> {
    return this.httpClient.get<Response<Player[]>>(`${this.apiUrl}/clubs/${clubId}/players`)
      .pipe(
        map((res: Response<Player[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getPlayerById(clubId: string, playerId: string): Observable<Player> {
    return this.httpClient.get<Response<Player>>(`${this.apiUrl}/clubs/${clubId}/players/${playerId}`)
      .pipe(
        map((res: Response<Player>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
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