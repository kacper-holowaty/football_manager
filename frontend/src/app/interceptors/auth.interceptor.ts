import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<string | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const accessToken = tokenService.getAccessToken();

  if (accessToken) {
    req = addAuthorizationHeader(req, accessToken);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && tokenService.getRefreshToken()) {
        return handleTokenRefresh(req, next, authService);
      }

      return throwError(() => error);
    }),
  );
};

const addAuthorizationHeader = (
  request: HttpRequest<unknown>,
  token: string,
): HttpRequest<unknown> => {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
};

const handleTokenRefresh = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService,
): Observable<HttpEvent<unknown>> => {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return authService.refreshToken().pipe(
      switchMap(({ accessToken: newAccessToken }) => {
        isRefreshing = false;
        refreshTokenSubject.next(newAccessToken);

        return next(addAuthorizationHeader(req, newAccessToken));
      }),
      catchError((error) => {
        isRefreshing = false;
        authService.logout();
        refreshTokenSubject.next(null);

        return throwError(() => error);
      }),
    );
  }

  return refreshTokenSubject.pipe(
    filter((token): token is string => token !== null),
    take(1),
    switchMap((newAccessToken) =>
      next(addAuthorizationHeader(req, newAccessToken)),
    ),
  );
};