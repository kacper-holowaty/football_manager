import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';

  constructor(private httpClient: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.httpClient.post(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  logout() {
    this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  register(user: User) {
    return this.httpClient.post(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/is-authenticated`, {withCredentials: true})
      .pipe(map(response => response.isAuthenticated));
  }

  getAuthenticatedUserId(): Observable<string> {
    return this.httpClient.get<{userId: string}>(`${this.apiUrl}/is-authenticated`, {withCredentials: true})
      .pipe(map(response => response.userId))
  }
}
