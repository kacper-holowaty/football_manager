import { Component } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { Router } from '@angular/router';
import { Club } from '../../../models/club.model';

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
  constructor(private router: Router, private clubService: ClubService) {}

  ngOnInit() {
    this.clubService.getAllClubs().subscribe({
      next: (clubs: Club[]) => {
        this.clubs = clubs;
      },
      error: (error) => {
        console.error('Error fetching clubs:', error);
      }
    });
  }

  viewClubDetails(id: string): void {
    this.router.navigate([`/club/${id}/main`]);
  }
}
