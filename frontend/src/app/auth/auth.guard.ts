import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  public constructor(private authService: AuthService, private router: Router) {}

  public canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          return true;
        } 
        this.router.navigate(['/login']);

        return false;
      }),
      catchError(() => {
        this.router.navigate(['/login']);

        return [false];
      })
    );
  }
}