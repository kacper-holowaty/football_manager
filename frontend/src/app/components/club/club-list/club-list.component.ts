import { Component } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { Router } from '@angular/router';
import { Club } from '../../../models/club.model';
import { CountryService } from '../../../services/country.service';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.scss'
})
export class ClubListComponent {

  clubs?: Club[];
  defaultBadgeUrl: string = "assets/empty_badge.png"
  countryCodes: { [country: string]: string } = {};

  constructor(private router: Router, private clubService: ClubService, private countryService: CountryService) {}

  ngOnInit() {
    this.clubService.getAllClubs().subscribe({
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
