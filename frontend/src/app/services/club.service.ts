import { Injectable } from '@angular/core';
import { Club, ClubRequest, UpdateClubRequest } from '../models/club.model';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Response } from '../models/response.type';

@Injectable({
  providedIn: 'root'
})
export class ClubService {
  private apiUrl = "http://localhost:8080/api/clubs";

  public constructor(private httpClient: HttpClient) {}

  public addClub(club: ClubRequest): Observable<Club> {
    const formData = new FormData();

    formData.append("name", club.name);
    formData.append("foundedYear", club.foundedYear.toString());
    formData.append("stadiumName", club.stadiumName);
    formData.append("stadiumCapacity", club.stadiumCapacity.toString());
    formData.append("ownerId", club.ownerId);

    formData.append("addressStreet", club.address.street);
    formData.append("addressHouseNumber", club.address.houseNumber);
    if (club.address.apartmentNumber) {
      formData.append("addressApartmentNumber", club.address.apartmentNumber);
    }
    formData.append("addressPostalCode", club.address.postalCode);
    formData.append("addressCity", club.address.city);
    formData.append("addressCountry", club.address.country);

    // club.achievements.forEach((achievement, index) => {
    //   formData.append(`achievements[${index}][name]`, achievement.name);
    //   formData.append(
    //     `achievements[${index}][date]`,
    //     new Date(achievement.date).toISOString()
    //   );
    //   formData.append(
    //     `achievements[${index}][description]`,
    //     achievement.description
    //   );
    // });

    if (club.badge) {
      formData.append("badge", club.badge);
    }
    
    return this.httpClient.post<Response<Club>>(this.apiUrl, formData)
      .pipe(
        map((response) => ({
          ...response.data,
          badgeUrl: response.data.hasBadge ? `${this.apiUrl}/${response.data.clubId}/badge` : undefined
        }))
      );
  }

  public getClubById(clubId: string): Observable<Club> {
    return this.httpClient.get<Response<Club>>(`${this.apiUrl}/${clubId}`)
      .pipe(
        map((res: Response<Club>) => ({
          ...res.data,
          badgeUrl: res.data.hasBadge ? `${this.apiUrl}/${clubId}/badge` : undefined
        })),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public updateClub(clubId: string, club: UpdateClubRequest): Observable<Club> {
    const formData = new FormData();

    formData.append("name", club.name);
    formData.append("foundedYear", club.foundedYear.toString());
    formData.append("stadiumName", club.stadiumName);
    formData.append("stadiumCapacity", club.stadiumCapacity.toString());
    formData.append("ownerId", club.ownerId);

    formData.append("addressStreet", club.address.street);
    formData.append("addressHouseNumber", club.address.houseNumber);
    if (club.address.apartmentNumber) {
      formData.append("addressApartmentNumber", club.address.apartmentNumber);
    }
    formData.append("addressPostalCode", club.address.postalCode);
    formData.append("addressCity", club.address.city);
    formData.append("addressCountry", club.address.country);

    // club.achievements.forEach((achievement, index) => {
    //   formData.append(`achievements[${index}][name]`, achievement.name);
    //   formData.append(
    //     `achievements[${index}][date]`,
    //     new Date(achievement.date).toISOString()
    //   );
    //   formData.append(
    //     `achievements[${index}][description]`,
    //     achievement.description
    //   );
    // });

    if (club.badge instanceof Blob) {
      formData.append("badge", club.badge);
    }
    
    return this.httpClient.put<Club>(`${this.apiUrl}/${clubId}`, formData);
  }

  public getClubsByOwnerId(ownerId: string): Observable<Club[]> {
    return this.httpClient.get<Response<Club[]>>(`${this.apiUrl}/user/${ownerId}`)
      .pipe(
        map((res: Response<Club[]>) => {
          const response = res.data;
          const clubs = response.map((club) => ({
            ...club,
            badgeUrl: club.hasBadge ? `${this.apiUrl}/${club.clubId}/badge` : undefined
          }));

          return clubs;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getAllClubs(): Observable<Club[]> {
    return this.httpClient.get<Response<Club[]>>(this.apiUrl)
      .pipe(
        map((res: Response<Club[]>) =>  {
          const response = res.data;
          const clubs = response.map((club) => ({
            ...club,
            badgeUrl: club.hasBadge ? `${this.apiUrl}/${club.clubId}/badge` : undefined
          }));

          return clubs;
        }),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public deleteClub(clubId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${clubId}`);
  }

  public removeClubBadge(clubId: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${clubId}/badge`);
  }

  public navbarClubIdSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public navbarClubId$ = this.navbarClubIdSubject.asObservable();
  
  public setClubId(id: string): void {
    this.navbarClubIdSubject.next(id);
  }
}
