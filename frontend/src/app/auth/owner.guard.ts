import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ClubService } from '../services/club.service';
import { Router } from '@angular/router';
import { switchMap, map, catchError, of } from 'rxjs';
import { Club } from '../models/club.model';

export const ownerGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const clubService = inject(ClubService);
  const router = inject(Router);

  const clubId = route.paramMap.get('id');

  if (!clubId) {
    router.navigate(['/']);

    return of(false);
  }

  return authService.getAuthenticatedUserId().pipe(
    switchMap((userId) => {
      if (!userId) {
        return of(false);
      }

      return clubService.getClubById(clubId).pipe(
        map((club: Club) => {
          if (club.ownerId === userId) {
            return true;
          } 
          
          return false;
        }),
        catchError(() => {
          router.navigate(['/']);

          return of(false);
        })
      );
    })
  );
};