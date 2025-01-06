import { Routes } from '@angular/router';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubMainComponent } from './club-main/club-main.component';

export const CLUB_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: ':id/main',
    component: ClubMainComponent,
    title: 'Club Homepage'
  },
  {
    path: 'list',
    component: ClubListComponent,
    title: 'Club List',
  },
  {
    path: 'form',
    component: ClubFormComponent,
    title: 'Add Club Form',
  },
  {
    path: ':id/form',
    component: ClubFormComponent,
    title: 'Edit Club Form',
  },
  {
    path: ':id/player',
    loadChildren: () =>
      import('../player/player.routes').then((r) => r.PLAYER_ROUTES),
  },
];