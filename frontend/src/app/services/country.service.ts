import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'http://localhost:3000/countries';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.apiUrl);
  }

  // getCountryCode(country: string): Observable<{ code: string }> {
  //   return this.httpClient.get<{ code: string }>(`${this.apiUrl}/${country}`);
  // }
  getCountryCodes(countries: string[]): Observable<{ country: string, code: string }[]> {
    return this.httpClient.post<{ country: string, code: string }[]>(`${this.apiUrl}/codes`, { countries });
  }
  
}
