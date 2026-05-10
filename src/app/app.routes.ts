import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
      },
      {
        path: 'users',
        loadComponent: () =>
          import('./features/users/users.component').then(m => m.UsersComponent),
      },
      {
        path: 'applications',
        loadComponent: () =>
          import('./features/applications/applications.component').then(m => m.ApplicationsComponent),
      },
      {
        path: 'schedule',
        loadComponent: () =>
          import('./features/schedule/schedule.component').then(m => m.ScheduleComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
