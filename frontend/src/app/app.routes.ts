import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(m => m.default),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./business/dashboard/dashboard').then(m => m.default)
      },
      {
        path: 'profile',
        loadComponent: () => import('./business/profile/profile').then(m => m.default)
      },
      {
        path: 'tables',
        children: [
          {
            path: '',
            loadComponent: () => import('./business/tables/tables').then(m => m.default)
          },
          {
            path: 'new',
            loadComponent: () =>
              import('./business/tables/product-form/product-form').then(m => m.default),
            data: { mode: 'create' }
          },
          {
            path: 'edit/:id',
            loadComponent: () =>
              import('./business/tables/product-form/product-form').then(m => m.default),
            data: { mode: 'edit' }
          }
        ]
      },
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];