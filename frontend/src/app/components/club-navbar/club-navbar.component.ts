import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ClubService } from '../../services/club.service';

@Component({
  selector: 'app-club-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './club-navbar.component.html',
  styleUrl: './club-navbar.component.scss'
})
export class ClubNavbarComponent implements OnInit {
  protected clubId: string = '';

  public constructor(private route: ActivatedRoute, private router: Router, private clubService: ClubService) {}

  public ngOnInit(): void {
    this.clubService.navbarClubId$.subscribe((id) => {
      this.clubId = id;
    }); 
  }
}
