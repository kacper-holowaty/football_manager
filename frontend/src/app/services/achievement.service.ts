import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Achievement, AchievementRequest } from '../models/achievement.model';
import { Response } from '../models/response.type';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private readonly apiUrl = 'http://localhost:8080/api';

  public constructor(private readonly http: HttpClient) { }

  public getAchievementsByClub(clubId: string, page: number, size: number): Observable<Achievement[]> {
    return this.http.get<Response<Achievement[]>>(`${this.apiUrl}/clubs/${clubId}/achievements?page=${page}&size=${size}`)
      .pipe(
        map((res: Response<Achievement[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getAchievementById(clubId: string, achievementId: string): Observable<Achievement> {
    return this.http.get<Response<Achievement>>(`${this.apiUrl}/clubs/${clubId}/achievements/${achievementId}`)
      .pipe(
        map((res: Response<Achievement>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public createAchievement(clubId: string, achievement: AchievementRequest): Observable<Achievement> {
    return this.http.post<Response<Achievement>>(`${this.apiUrl}/clubs/${clubId}/achievements`, achievement)
      .pipe(
        map((res: Response<Achievement>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public updateAchievement(clubId: string, achievementId: string, achievement: AchievementRequest): Observable<Achievement> {
    return this.http.put<Response<Achievement>>(`${this.apiUrl}/clubs/${clubId}/achievements/${achievementId}`, achievement)
      .pipe(
        map((res: Response<Achievement>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public deleteAchievement(clubId: string, achievementId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/clubs/${clubId}/achievements/${achievementId}`)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
}
