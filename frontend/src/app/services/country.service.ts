import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private apiUrl = 'http://localhost:3000/api/countries';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {
    return this.httpClient.get<Country[]>(this.apiUrl);
  }
}
