import { Injectable } from '@angular/core';
import { Player, PlayerRequest } from '../models/player.model';
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
        map((res: Response<Player[]>) =>  {
          const response = res.data;
          const players = response.map((player) => ({
            ...player,
            photoUrl: player.hasPhoto ? `${this.apiUrl}/clubs/${player.clubId}/players/${player.playerId}/photo` : undefined
          }));

          return players;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getPlayerById(clubId: string, playerId: string): Observable<Player> {
    return this.httpClient.get<Response<Player>>(`${this.apiUrl}/clubs/${clubId}/players/${playerId}`)
      .pipe(
        map((res: Response<Player>) => ({
          ...res.data,
          photoUrl: res.data.hasPhoto ? `${this.apiUrl}/clubs/${clubId}/players/${playerId}/photo` : undefined
        })),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public addPlayer(player: PlayerRequest): Observable<Player> {
    const formData = new FormData();
    formData.append("name", player.name);
    formData.append("birthDate", player.birthDate);
    formData.append("nationality", player.nationality);
    player.positions.forEach((position) => {
      formData.append("positions", position);
    });
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", player.contractUntil);
    formData.append("salary", player.salary.toString());
    formData.append("clubId", player.clubId);
  
    if (player.photo) {
      formData.append("photo", player.photo);
    }
  
    return this.httpClient.post<Response<Player>>(`${this.apiUrl}/clubs/${player.clubId}/players`, formData)
      .pipe(
        map((response) => ({
          ...response.data,
          photoUrl: response.data.hasPhoto ? `${this.apiUrl}/clubs/${player.clubId}/players/${response.data.playerId}/photo` : undefined
        }))
      );
  }

  public updatePlayer(playerId: string, player: PlayerRequest): Observable<Player> {
    const formData = new FormData();
    formData.append("name", player.name);
    formData.append("birthDate", player.birthDate);
    formData.append("nationality", player.nationality);
    player.positions.forEach((position) => {
      formData.append("positions", position);
    });
    formData.append("shirtNumber", player.shirtNumber.toString());
    formData.append("contractUntil", player.contractUntil);
    formData.append("salary", player.salary.toString());
    formData.append("clubId", player.clubId);
  
    if (player.photo instanceof Blob) {
      formData.append("photo", player.photo);
    }
  
    return this.httpClient.put<Response<Player>>(`${this.apiUrl}/clubs/${player.clubId}/players/${playerId}`, formData)
      .pipe(
        map((response) => ({
          ...response.data,
          photoUrl: response.data.hasPhoto ? `${this.apiUrl}/clubs/${player.clubId}/players/${response.data.playerId}/photo` : undefined
        }))
      );
  }
  
  public deletePlayer(clubId: string, playerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/clubs/${clubId}/players/${playerId}`);
  }

  public removePlayerPhoto(clubId: string, playerId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/clubs/${clubId}/players/${playerId}/photo`);
  }

  public getPlayerPhotoAsBlob(clubId: string, playerId: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/clubs/${clubId}/players/${playerId}/photo`, { responseType: 'blob' });
  }
}