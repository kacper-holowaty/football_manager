import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from '../../../models/club.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-club-main',
  standalone: true,
  imports: [],
  templateUrl: './club-main.component.html',
  styleUrl: './club-main.component.scss'
})
export class ClubMainComponent implements OnInit {
  protected club?: Club;
  protected defaultBadgeUrl: string = 'assets/empty_badge.png';
  protected currentUserId: string = '';
  protected isUserLoggedIn: boolean = false;
  
  public constructor(private route: ActivatedRoute, private clubService: ClubService, private router: Router, private authService: AuthService) {}
  
  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clubService.getClubById(id).subscribe({
        next: (club: Club) => {
          this.club = club;
        },
        error: (error) => {
          console.error('Error fetching club data:', error);
        }
      });
    }

    this.authService.isAuthenticated().subscribe((isAuthenticated) => {
      this.isUserLoggedIn = isAuthenticated;
    });

    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });

  }

  public editClub(id: string): void {
    this.router.navigate([`/club/${id}/form`]);
  }

  public deleteClub(id: string): void {
    if (confirm('Are you sure you want to delete your club?')) {
      this.clubService.deleteClub(id).subscribe({
        next: () => {
          console.log('Club deleted successfully');
          this.router.navigate(['/main']);
        },
        error: (error) => {
          console.error('Error deleting club:', error);
        }
      });
    }
  }
}
