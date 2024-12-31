import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';

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

  getProtectedData() {
    return this.httpClient.get(`${this.apiUrl}/protected`, { withCredentials: true });
  }

  register(user: User) {
    return this.httpClient.post(`${this.apiUrl}/register`, user, { withCredentials: true });
  }
}
