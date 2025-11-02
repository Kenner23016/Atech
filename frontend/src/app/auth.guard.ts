import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get('/api/auth/me').pipe(
    map(() => true),
    catchError(() => {
      // si NO hay sesión -> manda al login de Angular
      router.navigate(['/login'], {
        queryParams: { returnUrl: state.url },
      });
      return of(false);
    }),
  );
};

