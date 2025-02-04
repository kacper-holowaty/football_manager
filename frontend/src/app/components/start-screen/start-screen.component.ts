import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent implements OnInit {
  protected logoUrl: string = "assets/gold_logo.png";
  protected applicationName: string = "FC Manager";

  public constructor(private router: Router, private authService: AuthService) {}
  
  public ngOnInit(): void {
    this.authService.logout();
  }

  protected navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  protected navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  protected navigateToClubs(): void {
    this.router.navigate(['/club']);
  }
}
