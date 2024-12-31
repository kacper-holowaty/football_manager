import { Routes } from '@angular/router';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { PlayerFormComponent } from './player-form/player-form.component';
import { PlayerListComponent } from './player-list/player-list.component';


export const PLAYER_ROUTES: Routes = [
    {
      path: '',
      pathMatch: 'full',
      redirectTo: 'list',
    },
    {
      path: 'list',
      component: PlayerListComponent,
      title: 'Players',
    },
    {
      path: 'form',
      component: PlayerFormComponent,
      title: 'Add Player Form'
    },
    {
        path: ':playerId/form',
        component: PlayerFormComponent,
        title: 'Edit Player Form',
      },
    {
      path: ':playerId/details',
      component: PlayerDetailsComponent,
      title: 'Player Details',
    },
  ];
  