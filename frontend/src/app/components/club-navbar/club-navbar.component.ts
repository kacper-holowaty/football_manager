import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ClubService } from '../../services/club.service';
import { MatToolbarModule } from '@angular/material/toolbar'; 
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-club-navbar',
  standalone: true,
  imports: [RouterModule, MatToolbarModule],
  templateUrl: './club-navbar.component.html',
  styleUrl: './club-navbar.component.scss'
})
export class ClubNavbarComponent implements OnInit {
  protected clubId: string = '';
  protected logoUrl: string = "assets/images/gold_logo.png";
  protected applicationName: string = "FC Manager";
  protected isAuthenticated: boolean = false;

  public constructor( private router: Router, private clubService: ClubService, private authService: AuthService) {}

  public ngOnInit(): void {
    this.clubService.navbarClubId$.subscribe((id) => {
      this.clubId = id;
    }); 
    this.checkAuthentication();
  }

  private checkAuthentication(): void {
    if (this.authService.isAuthenticated()) {
      this.isAuthenticated = true;
    }
  }

  public goBack(): void {
    if (this.isAuthenticated) {
      this.router.navigate([`/main`]);
    } else {
      this.router.navigate(['/club/list']);
    }
  }
}