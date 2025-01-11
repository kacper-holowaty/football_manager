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
  protected logoUrl: string = "assets/gold_logo.png";
  protected applicationName: string = "FC Manager";

  public constructor(private router: Router) {}
  
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
