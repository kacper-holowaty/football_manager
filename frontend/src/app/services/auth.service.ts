import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, EMPTY, map, Observable, tap, throwError } from 'rxjs';
import { ToastService } from './toast.service';
import { AuthDto, AuthPayload, RefreshTokenDto } from '../models/dto/auth.dto';
import { User, UserRequest } from '../models/user.model';
import { Response } from '../models/types/response.type';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  public constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toastService: ToastService,
    @Inject(TokenService) private tokenService: TokenService
  ) {}

  public login(user: AuthPayload): Observable<AuthDto> {
    return this.httpClient.post<Response<AuthDto>>(`${this.apiUrl}/authenticate`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          const { accessToken, refreshToken, user } = res.data;
          this.tokenService.setTokens(accessToken, refreshToken);
          this.currentUserSubject.next(user);
          this.router.navigate(['/main']);
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
    this.currentUserSubject.next(null);
  }

  public register(user: UserRequest): Observable<AuthDto> {
    return this.httpClient.post<Response<AuthDto>>(`${this.apiUrl}/register`, user)
      .pipe(
        tap((res: Response<AuthDto>) => {
          console.log(JSON.stringify(res));
          console.log(JSON.stringify(res.data));
          const { accessToken, refreshToken, user } = res.data;
          this.tokenService.setTokens(accessToken, refreshToken);
          this.currentUserSubject.next(user);
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

    return this.httpClient.post<Response<RefreshTokenDto>>(`${this.apiUrl}/refresh-token`, { refreshToken })
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
    return this.currentUser$.pipe(
      map((user) => (user ? user.id : ''))
    );
  }

  public getUserById(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/user/${userId}`);
  }
}
