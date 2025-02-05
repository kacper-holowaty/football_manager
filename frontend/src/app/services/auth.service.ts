import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

interface AuthResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000';

  public constructor(private httpClient: HttpClient, private router: Router) {}

  public login(email: string, password: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true });
  }

  public logout(): void {
    this.isAuthenticated().subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.httpClient.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
          next: () => {
            console.log('User logged out');
          },
          error: (err) => {
            console.error('Error during logout', err);
          }
        });
      }
    });
  }

  public register(user: User): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/register`, user, { withCredentials: true });
  }

  public isAuthenticated(): Observable<boolean> {
    return this.httpClient.get<{ isAuthenticated: boolean }>(`${this.apiUrl}/is-authenticated`, {withCredentials: true})
      .pipe(
        map((response) => response.isAuthenticated), 
        catchError(() => {
          return of(false);
        })
      );
  }

  public getAuthenticatedUserId(): Observable<string> {
    return this.httpClient.get<{userId: string}>(`${this.apiUrl}/is-authenticated`, {withCredentials: true})
      .pipe(map((response) => response.userId),
        catchError(() => {
          return of('');
        })
      );
  }

  public getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/user/${userId}`);
  }
}
