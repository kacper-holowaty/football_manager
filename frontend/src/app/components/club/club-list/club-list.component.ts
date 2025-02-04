import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { Router } from '@angular/router';
import { Club } from '../../../models/club.model';
import { CountryService } from '../../../services/country.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.scss'
})
export class ClubListComponent implements OnInit {
  protected clubs?: Club[];
  protected filteredClubs: Club[] = [];
  protected defaultBadgeUrl: string = "assets/empty_badge.png";
  protected countryCodes: Record<string, string> = {};
  protected availableCountries: string[] = [];
  
  protected searchName: string = '';
  protected selectedCountry: string = '';
  protected onlyWithBadge: boolean = false;

  public constructor(private router: Router, private clubService: ClubService, private countryService: CountryService, private location: Location) {}

  public ngOnInit(): void {
    this.clubService.getAllClubs().subscribe({
      next: (clubs: Club[]) => {
        this.clubs = clubs;
        this.filteredClubs = [...this.clubs];

        if (this.clubs.length > 0) {
          this.loadCountryFlags(this.clubs);
          this.availableCountries = [...new Set(this.clubs.map((club) => club.address.country))];
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

  protected goBack(): void {
    this.location.back();
  }

  protected goHome(): void {
    this.router.navigate(['/']);
  }

  protected filterClubs(): void {
    this.filteredClubs = this.clubs?.filter((club) =>
      club.name.toLowerCase().includes(this.searchName.toLowerCase()) &&
      (this.selectedCountry ? club.address.country === this.selectedCountry : true) &&
      (!this.onlyWithBadge || club.badge !== null)
    ) || [];
  }
}
