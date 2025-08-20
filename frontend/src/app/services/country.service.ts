import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Country } from '../models/country.model';
import { Response } from '../models/response.type';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'http://localhost:8080/api/countries';

  public constructor(private httpClient: HttpClient) { }

  public getCountries(): Observable<Country[]> {
    return this.httpClient.get<Response<Country[]>>(this.apiUrl)
      .pipe(
        map((res: Response<Country[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }

  public getCountryCodes(countries: string[]): Observable<Country[]> {
    return this.httpClient.post<Response<Country[]>>(`${this.apiUrl}/codes`, { countries })
      .pipe(
        map((res: Response<Country[]>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
  
  public getCountryCode(country: string): Observable<{ code: string }> {
    return this.httpClient.get<Response<{ code: string }>>(`${this.apiUrl}/${country}`)
      .pipe(
        map((res: Response<{ code: string }>) => res.data),
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
  }
}
