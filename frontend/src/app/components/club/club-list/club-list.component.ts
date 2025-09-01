import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { Router } from '@angular/router';
import { Club } from '../../../models/club.model';
import { Page } from '../../../models/pagination.model';
import { CountryService } from '../../../services/country.service';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-club-list',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatPaginatorModule, MatCheckboxModule],
  templateUrl: './club-list.component.html',
  styleUrl: './club-list.component.scss'
})
export class ClubListComponent implements OnInit {
  protected clubs: Club[] = [];
  protected totalClubs: number = 0;
  protected defaultBadgeUrl: string = "assets/images/empty_badge.png";
  protected countryCodes: Record<string, string> = {};
  protected availableCountries: string[] = [];
  
  protected searchName: string = '';
  protected selectedCountry: string = '';
  protected onlyWithBadge: boolean = false;

  protected pageSize = 5;
  protected pageIndex = 0;
  protected pageSizeOptions: number[] = [5, 10, 20];

  public constructor(private router: Router, private clubService: ClubService, private countryService: CountryService, private location: Location) {}

  public ngOnInit(): void {
    this.fetchClubs();
  }

  private fetchClubs(): void {
    this.clubService.getAllClubs(this.pageIndex, this.pageSize, 'name,asc').subscribe({
      next: (response: { data: Page<Club> }) => {
        this.clubs = response.data.content;
        this.totalClubs = response.data.totalElements;

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
    this.pageIndex = 0;
    this.fetchClubs();
  }

  protected onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchClubs();
  }
}
