import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MainComponent } from './main/main.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [{
    path: '',
    component: StartScreenComponent,
  },    
// {
//     path: 'player',
//     loadChildren: () =>
//       import('./player/player.routes').then((r) => r.PLAYER_ROUTES),
// },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'main',
    component: MainComponent, 
    canActivate: [AuthGuard],
  },
  {
    path: 'club',
    loadChildren: () =>
      import('./club/club.routes').then((r) => r.CLUB_ROUTES),
  },
{
    path: 'page-not-found',
    component: PageNotFoundComponent,
},
{ 
    path: '**',
    redirectTo: 'page-not-found',
}];
