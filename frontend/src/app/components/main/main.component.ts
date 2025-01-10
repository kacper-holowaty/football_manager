import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClubService } from '../../services/club.service';
import { Club } from '../../models/club.model';
import { CountryService } from '../../services/country.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

  isUserLoggedIn: boolean = false;
  currentUserId: string = '';
  defaultBadgeUrl: string = 'assets/empty_badge.png';
  clubs?: Club[];
  countryCodes: { [country: string]: string } = {};

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

  private loadUserClubs(): void {
    if (this.currentUserId) {
      this.clubService.getClubsByOwnerId(this.currentUserId).subscribe({
        next: (clubs: Club[]) => {
          this.clubs = clubs;
          if (this.clubs.length > 0) {
            this.loadCountryFlags(this.clubs);
          }
        },
        error: (error) => {
          console.error('Error fetching clubs:', error);
        }
      });
    }
  }

  loadCountryFlags(clubs: Club[]) {
    const countries = clubs.map(club => club.address.country);
    this.countryService.getCountryCodes(countries).subscribe({
      next: (codes) => {
        codes.forEach(code => {
          this.countryCodes[code.country] = code.code;
        });
      },
      error: (err) => {
        console.error('Error fetching country codes', err);
      }
    });
  }

  getCountryCode(country: string): string {
    return this.countryCodes[country] || '';
  }

  viewClubDetails(id: string): void {
    this.router.navigate([`/club/${id}/main`]);
  }
}


