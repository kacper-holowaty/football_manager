import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  public constructor(private router: Router) {}

  public isExcludedRoute(): boolean {
    const excludedRoutes = ['/club/list', '/'];

    return excludedRoutes.includes(this.router.url);
  }
}
