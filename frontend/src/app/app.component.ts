import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ClubNavbarComponent } from './components/club-navbar/club-navbar.component';
import { ClubService } from './services/club.service';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ClubNavbarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public title: string = 'frontend';

  protected showNavbar: boolean = false;

  public constructor(private router: Router, private route: ActivatedRoute, private clubService: ClubService) {
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.showNavbar = this.shouldShowNavbar();
      
      if (this.showNavbar) {
        this.updateClubIdFromUrl();
      }
    });
  }

  public shouldShowNavbar(): boolean {
    const url = this.router.url;
    const regex = /^\/club\/[0-9a-fA-F-]{36}(\/.*)?$/;

    return regex.test(url);
  }

  private updateClubIdFromUrl(): void {
    const match = this.router.url.match(/^\/club\/([0-9a-fA-F-]{36})/);
    if (match) {
      const clubId = match[1];
      this.clubService.setClubId(clubId);
    }
  }
}
