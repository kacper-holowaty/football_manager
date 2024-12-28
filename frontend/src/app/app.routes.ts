import { Routes } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [{
    path: '',
    component: StartScreenComponent,
},    
{
    path: 'player',
    loadChildren: () =>
      import('./player/player.routes').then((r) => r.PLAYER_ROUTES),
  },

// { path: 'info', component: InfoComponent },
{
    path: 'page-not-found',
    component: PageNotFoundComponent,
},
{ 
    path: '**',
    redirectTo: 'page-not-found',
 },];
