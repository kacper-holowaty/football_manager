import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Achievement } from '../../../models/achievement.model';
import { AchievementService } from '../../../services/achievement.service';
import { ToastService } from '../../../services/toast.service';
import { DatePipe } from '@angular/common';
import { DeleteAchievementDialogComponent } from '../delete-achievement-dialog/delete-achievement-dialog.component';
import { AchievementFormComponent } from '../achievement-form/achievement-form.component';
import { ClubService } from '../../../services/club.service';
import { Club } from '../../../models/club.model';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-achievement-main',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatPaginatorModule, MatDialogModule, DatePipe],
  templateUrl: './achievement-main.component.html',
  styleUrl: './achievement-main.component.scss'
})
export class AchievementMainComponent implements OnInit {
  protected clubId: string = '';
  protected clubFoundedYear: number = 0;
  protected achievements: Achievement[] = [];
  protected sortedAchievements: Achievement[] = [];
  protected paginatedAchievements: Achievement[] = [];
  protected pageSize: number = 3;
  protected currentPage: number = 0;
  protected totalAchievements: number = 0;
  protected currentUserId: string = '';
  protected isUserLoggedIn: boolean = false;
  protected clubOwnerId: string = '';

  public constructor(
    private route: ActivatedRoute,
    private achievementService: AchievementService,
    private clubService: ClubService,
    private dialog: MatDialog,
    private toastService: ToastService,
    private authService: AuthService
  ) {}

  public ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clubId = id;
      this.clubService.getClubById(this.clubId).subscribe({
        next: (club: Club) => {
          this.clubFoundedYear = club.foundedYear;
          this.clubOwnerId = club.ownerId;
          this.loadAchievements();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error fetching club data:', error);
          this.toastService.showToast('Error fetching club data.');
        }
      });
    }

    this.isUserLoggedIn = this.authService.isAuthenticated();
    this.authService.getAuthenticatedUserId().subscribe((userId: string) => {
      this.currentUserId = userId;
    });
  }

  private loadAchievements(): void {
    this.achievementService.getAchievementsByClub(this.clubId, this.currentPage, this.pageSize).subscribe({
      next: (achievements: Achievement[]) => {
        this.achievements = achievements;
        this.sortedAchievements = [...achievements].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        this.totalAchievements = achievements.length;
        this.updatePaginatedAchievements();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching achievements:', error);
        this.toastService.showToast('Error fetching achievements.');
      }
    });
  }

  private updatePaginatedAchievements(): void {
    const startIndex = this.currentPage * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAchievements = this.sortedAchievements.slice(startIndex, endIndex);
  }

  public changePage(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadAchievements();
  }

  public openAddAchievementForm(): void {
    const dialogRef = this.dialog.open(AchievementFormComponent, {
      width: '500px',
      data: { clubId: this.clubId, editing: false, clubFoundedYear: this.clubFoundedYear }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadAchievements();
      }
    });
  }

  public openEditAchievementForm(achievement: Achievement): void {
    const dialogRef = this.dialog.open(AchievementFormComponent, {
      width: '500px',
      data: { clubId: this.clubId, editing: true, achievement: achievement, clubFoundedYear: this.clubFoundedYear }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.loadAchievements();
      }
    });
  }

  public openDeleteAchievementConfirmationDialog(achievementId: string): void {
    const dialogRef = this.dialog.open(DeleteAchievementDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.deleteAchievement(achievementId);
      }
    });
  }

  private deleteAchievement(achievementId: string): void {
    this.achievementService.deleteAchievement(this.clubId, achievementId).subscribe({
      next: () => {
        this.toastService.showToast("Achievement deleted successfully!");
        this.loadAchievements();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error deleting achievement:', error);
        this.toastService.showToast("Error deleting achievement.");
      }
    });
  }
}
