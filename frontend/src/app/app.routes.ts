import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  // ====== LOGIN (SPA) ======
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login').then((m) => m.default),
  },

  // ====== LAYOUT PRINCIPAL ======
  {
    path: '',
    // este es tu layout real
    loadComponent: () =>
      import('./components/layout/layout').then((m) => m.default),
    children: [
      // ====== PÚBLICO / PRINCIPAL ======
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./business/dashboard/dashboard').then((m) => m.default),
      },

      // ====== PROTEGIDOS ======
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./business/profile/profile').then((m) => m.default),
      },
      {
        path: 'tables',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./business/tables/tables').then((m) => m.default),
      },
      {
        path: 'tables/new',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./business/tables/product-form/product-form').then(
            (m) => m.default,
          ),
      },
      {
        path: 'tables/edit/:id',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./business/tables/product-form/product-form').then(
            (m) => m.default,
          ),
      },

      // ====== REDIRECT POR DEFECTO ======
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard',
      },
    ],
  },

  // cualquier cosa rara -> al dashboard
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];

