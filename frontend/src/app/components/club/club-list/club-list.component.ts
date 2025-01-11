import { Component, OnInit } from '@angular/core';
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
export class ClubListComponent implements OnInit {
  protected clubs?: Club[];
  protected defaultBadgeUrl: string = "assets/empty_badge.png";
  protected countryCodes: Record<string, string> = {};

  public constructor(private router: Router, private clubService: ClubService, private countryService: CountryService) {}

  public ngOnInit(): void {
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

  private loadCountryFlags(clubs: Club[]): void {
    const countries = clubs.map((club) => club.address.country);
    this.countryService.getCountryCodes(countries).subscribe({
      next: (codes) => {
        codes.forEach((code) => {
          this.countryCodes[code.country] = code.code;
        });
      },
      error: (err) => {
        console.error('Error fetching country codes', err);
      }
    });
  }

  protected getCountryCode(country: string): string {
    return this.countryCodes[country] || '';
  }

  protected viewClubDetails(id: string): void {
    this.router.navigate([`/club/${id}/main`]);
  }
}
