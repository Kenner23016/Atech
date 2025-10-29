import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadComponent: () => import('./components/layout/layout').then(m => m.default),
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./business/dashboard/dashboard').then(m => m.default),

        },
         {
            path: 'profile',
            loadComponent: () => import('./business/profile/profile').then(m => m.default),

        },
         {
            path: 'tables',
            loadComponent: () => import('./business/tables/tables').then(m => m.default),

        },
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }

]

        },
        {
            path: '**',
            redirectTo: 'dashboard'

        }
];
