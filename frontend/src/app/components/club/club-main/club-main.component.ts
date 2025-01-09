import { Component } from '@angular/core';
import { ClubService } from '../../../services/club.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Club } from '../../../models/club.model';

@Component({
  selector: 'app-club-main',
  standalone: true,
  imports: [],
  templateUrl: './club-main.component.html',
  styleUrl: './club-main.component.scss'
})
export class ClubMainComponent {
  club?: Club;
  defaultBadgeUrl: string = 'assets/empty_badge.png';
  apiUrl: string = "http://localhost:3000"
  
  constructor(private route: ActivatedRoute, private clubService: ClubService, private router: Router) {}
  
  ngOnInit(): void {
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
  }
}
