import { Component, OnInit } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from '../../../models/club.model';
import { AuthService } from '../../../services/auth.service';
import { CountryService } from '../../../services/country.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteClubDialogComponent } from './delete-club-dialog/delete-club-dialog.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-club-main',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatDialogModule],
  templateUrl: './club-main.component.html',
  styleUrl: './club-main.component.scss'
})
export class ClubMainComponent implements OnInit {
  protected club?: Club;
  protected defaultBadgeUrl: string = 'assets/images/empty_badge.png';
  protected currentUserId: string = '';
  protected isUserLoggedIn: boolean = false;
  protected countryCode: string = '';
  
  // protected sortedAchievements: Achievement[] = [];
  // protected paginatedAchievements: Achievement[] = [];
  // protected pageSize: number = 2;
  // protected currentPage: number = 0;

  public constructor(private route: ActivatedRoute, private clubService: ClubService, private router: Router, private authService: AuthService, private countryService: CountryService, private dialog: MatDialog, private toastService: ToastService) {}
  
  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clubService.getClubById(id).subscribe({
        next: (club: Club) => {
          this.club = club;

          // this.sortedAchievements = [...club.achievements].sort(
          //   (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          // );
          // this.updatePaginatedAchievements();

          this.countryService.getCountryCode(club.address.country).subscribe((result) => {
            this.countryCode = result.code;
          });
        },
        error: (error) => {
          console.error('Error fetching club data:', error);
        }
      });
    }

    this.isUserLoggedIn = this.authService.isAuthenticated();
    
    this.authService.getAuthenticatedUserId().subscribe((userId) => {
      this.currentUserId = userId;
    });
  }

  // private updatePaginatedAchievements(): void {
  //   const startIndex = this.currentPage * this.pageSize;
  //   const endIndex = startIndex + this.pageSize;
  //   this.paginatedAchievements = this.sortedAchievements.slice(startIndex, endIndex);
  // }

  // public changePage(event: PageEvent): void {
  //   this.currentPage = event.pageIndex;
  //   this.pageSize = event.pageSize;
  //   this.updatePaginatedAchievements();
  // }

  public openDeleteClubConfirmationDialog(clubId: string): void {
    const dialogRef = this.dialog.open(DeleteClubDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteClub(clubId);
      }
    });
  }

  public editClub(id: string): void {
    this.router.navigate([`/club/${id}/form`]);
  }

  public deleteClub(id: string): void {
    this.clubService.deleteClub(id).subscribe({
      next: () => {
        this.toastService.showToast("Club deleted successfully!");
        this.router.navigate(['/main']);
      },
      error: (error) => {
        console.error('Error deleting club:', error);
      }
    });
  }
}
