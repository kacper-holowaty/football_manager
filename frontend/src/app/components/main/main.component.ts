import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ClubService } from '../../services/club.service';
import { CountryService } from '../../services/country.service';
import { UserService } from '../../services/user.service';
import { Club } from '../../models/club.model';
import { User } from '../../models/user.model';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditUserDialogComponent } from '../edit-user-dialog/edit-user-dialog.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterModule, MatIconModule, MatMenuModule, MatDialogModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {

  protected isUserLoggedIn: boolean = false;
  protected currentUserId: string = '';
  protected defaultBadgeUrl: string = 'assets/images/empty_badge.png';
  protected clubs: Club[] = [];
  protected countryCodes: Record<string, string> = {};
  protected currentUserName: string = '';
  protected currentUser: User | undefined;

  public constructor(
    private authService: AuthService,
    private router: Router,
    private clubService: ClubService,
    private countryService: CountryService,
    private userService: UserService,
    private dialog: MatDialog,
    private toastService: ToastService
  ) {}

  public ngOnInit(): void {
    this.isUserLoggedIn = this.authService.isAuthenticated();
    
    if (this.isUserLoggedIn) {
      this.authService.getAuthenticatedUserId().subscribe((userId) => {
        this.currentUserId = userId;
        this.loadUserClubs();
        this.authService.getUserById(this.currentUserId).subscribe({
          next: (user: User) => {
            this.currentUser = user;
            this.currentUserName = `${user.firstName} ${user.lastName} (${user.username})`;
          },
          error: (err: HttpErrorResponse) => console.error('Error fetching user:', err),
        });
      });
    }
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

  protected openEditUserDialog(): void {
    if (!this.currentUser) {
      this.toastService.showToast('User data not loaded yet.');
      
      return;
    }

    const dialogRef = this.dialog.open(EditUserDialogComponent, {
      width: '400px',
      data: {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email
      }
    });

    dialogRef.afterClosed().subscribe((result: Partial<User> | undefined) => {
      if (result) {
        this.userService.updateUser(this.currentUserId, result).subscribe({
          next: (updatedUser: User) => {
            this.currentUser = updatedUser;
            this.currentUserName = `${updatedUser.firstName} ${updatedUser.lastName} (${updatedUser.username})`;
            this.toastService.showToast('User data updated successfully!');
          },
          error: (err: HttpErrorResponse) => {
            console.error('Error updating user:', err);
            this.toastService.showToast('Failed to update user data.');
          }
        });
      }
    });
  }
}
