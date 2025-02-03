import { Routes } from '@angular/router';
import { ClubFormComponent } from './club-form/club-form.component';
import { ClubListComponent } from './club-list/club-list.component';
import { ClubMainComponent } from './club-main/club-main.component';
import { authGuard } from '../../auth/auth.guard';
import { ownerGuard } from '../../auth/owner.guard';

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
    canActivate: [authGuard],
  },
  {
    path: ':id/form',
    component: ClubFormComponent,
    title: 'Edit Club Form',
    canActivate: [ownerGuard],
  },
  {
    path: ':id/player',
    loadChildren: () =>
      import('../player/player.routes').then((r) => r.PLAYER_ROUTES),
  },
];