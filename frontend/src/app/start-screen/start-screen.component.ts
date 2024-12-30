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
  
  logoUrl: string = "assets/logo_fc_manager.png"
  
  constructor(private router: Router) {}

  
  navigateToLogin() {
    this.router.navigate(['/login']); // Przekierowanie na stronę logowania
  }

  navigateToRegister() {
    this.router.navigate(['/register']); // Przekierowanie na stronę rejestracji
  }

  navigateToClubs() {
    this.router.navigate(['/clubs']); // Przekierowanie na stronę klubów
  }
}
