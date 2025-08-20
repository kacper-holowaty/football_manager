import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  public setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  public getAccessToken(): string | null {
    return sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public clearTokens(): void {
    sessionStorage.removeItem(this.ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  public isLoggedIn(): boolean {
    return !!sessionStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public setUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(): User | null {
    const user = sessionStorage.getItem('user');
    
    return user ? JSON.parse(user) : null;
  }

  public removeUser(): void {
    sessionStorage.removeItem('user');
  }
}
