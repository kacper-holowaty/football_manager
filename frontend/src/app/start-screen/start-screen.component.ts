import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss'
})
export class StartScreenComponent {
  
  logoUrl: string = "assets/gold_logo.png"
  applicationName: string = "FC Manager"

  constructor(private router: Router) {}
  
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToClubs() {
    this.router.navigate(['/club']);
  }
}
