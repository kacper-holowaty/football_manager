import { Routes } from '@angular/router';
import { StartScreenComponent } from './components/start-screen/start-screen.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MainComponent } from './components/main/main.component';
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
      import('./components/club/club.routes').then((r) => r.CLUB_ROUTES),
  },
{
    path: 'page-not-found',
    component: PageNotFoundComponent,
},
{ 
    path: '**',
    redirectTo: 'page-not-found',
}];
