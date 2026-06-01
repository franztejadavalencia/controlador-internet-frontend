import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
  },
  {
    path: '',
    loadComponent: () => import('./layouts/admin-layout/admin-layout').then(m => m.AdminLayout),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
      },
      {
        path: 'auth/persons',
        loadComponent: () => import('./modules/auth/components/person/person.component').then(m => m.PersonComponent),
      },
      {
        path: 'billing/plans',
        loadComponent: () => import('./modules/billing/components/plan/plan.component').then(m => m.PlanComponent),
      },
      {
        path: 'billing/clients',
        loadComponent: () => import('./modules/billing/components/client/client.component').then(m => m.ClientComponent),
      },
      {
        path: 'billing/subscriptions',
        loadComponent: () => import('./modules/billing/components/subscription/subscription.component').then(m => m.SubscriptionComponent),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  }
];
