import { Injectable, Inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { AuthDto, AuthPayload, RefreshTokenDto } from '../models/auth.model';
import { User, UserRequest } from '../models/user.model';
import { Response } from '../models/response.type';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  public constructor(
    private httpClient: HttpClient,
    private toastService: ToastService,
    @Inject(TokenService) private tokenService: TokenService
  ) {}

  public login(user: AuthPayload): Observable<AuthDto> {
    return this.httpClient.post<Response<AuthDto>>(`${this.apiUrl}/auth/authenticate`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          const { accessToken, refreshToken, user } = res.data;
          this.tokenService.setTokens(accessToken, refreshToken);
          this.tokenService.setUser(user);
        }),
        map((res: Response<AuthDto>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.toastService.showToast('Login failed');

          return throwError(() => err);
        })
      );
  }

  public logout(): void {
    this.tokenService.clearTokens();
    this.tokenService.removeUser();
  }

  public register(user: UserRequest): Observable<AuthDto> {
    return this.httpClient.post<Response<AuthDto>>(`${this.apiUrl}/auth/register`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          const { accessToken, refreshToken, user } = res.data;
          this.tokenService.setTokens(accessToken, refreshToken);
          this.tokenService.setUser(user);
        }),
        map((res: Response<AuthDto>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.toastService.showToast('Registration failed');

          return throwError(() => err);
        })
      );
  }

  public isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }

  public refreshToken(): Observable<RefreshTokenDto> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      this.logout();

      return EMPTY;
    }

    return this.httpClient.post<Response<RefreshTokenDto>>(`${this.apiUrl}/auth/refresh-token`, { refreshToken })
      .pipe(
        tap((res: Response<RefreshTokenDto>) => {
          const { accessToken, refreshToken } = res.data;
          this.tokenService.setTokens(accessToken, refreshToken);
        }),
        map((res: Response<RefreshTokenDto>) => res.data),
        catchError((err: HttpErrorResponse) => {
          this.logout();

          return throwError(() => err);
        })
      );
  }

  public getAuthenticatedUserId(): Observable<string> {
    return new Observable<string>((subscriber) => {
      const user = this.tokenService.getUser();
      subscriber.next(user ? user.userId : '');
      subscriber.complete();
    });
  }

  public getUserById(userId: string): Observable<User> {
    return this.httpClient
      .get<Response<User>>(`${this.apiUrl}/users/${userId}`)
      .pipe(
        map((res: Response<User>) => res.data),
        catchError((err: HttpErrorResponse) => {
          console.error('Error fetching user:', err);

          return throwError(() => err);
        })
      );
  }
}
