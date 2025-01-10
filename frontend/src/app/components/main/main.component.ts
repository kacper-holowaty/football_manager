import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club.model';
import { CountryService } from '../../services/country.service';
import { catchError, Observable, of } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  isUserLoggedIn: boolean = false;
  currentUserId: string = '';
  defaultBadgeUrl: string = 'assets/empty_badge.png';
  clubs?: Club[];

  constructor(private authService: AuthService, private router: Router, private clubService: ClubService, private countryService: CountryService) {}

  ngOnInit(): void {
    this.authService.isAuthenticated().subscribe(isAuthenticated => {
      this.isUserLoggedIn = isAuthenticated;

      if (this.isUserLoggedIn) {
        this.authService.getAuthenticatedUserId().subscribe(userId => {
          this.currentUserId = userId;

          this.loadUserClubs();
        });
      }
    });
  }




  // TO DO POPRAWKI NATYCHMIAST!
  // getCountryCode(country: string): Observable<string> | null {
  //   if (!country) {
  //     return of('');
  //   }
  //   return this.countryService.getCountryCode(country).pipe(
  //     catchError(() => of(''))
  //   );
  // } 

  private loadUserClubs(): void {
    if (this.currentUserId) {
      this.clubService.getClubsByOwnerId(this.currentUserId).subscribe({
        next: (clubs: Club[]) => {
          this.clubs = clubs;
        },
        error: (error) => {
          console.error('Error fetching clubs:', error);
        }
      });
    }
  }

  viewClubDetails(id: string): void {
    this.router.navigate([`/club/${id}/main`]);
  }
}


