import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router); 

  return authService.isAuthenticated().pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      } 
      router.navigate(['/login']);

      return false;
    }),
    catchError(() => {
      router.navigate(['/login']);
        
      return of(false);
    })
  );
};
