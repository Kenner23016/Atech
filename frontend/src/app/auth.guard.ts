import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const http = inject(HttpClient);

  return http.get('/api/auth/me').pipe(
    map(() => true),
    catchError(() => {
      // si NO hay sesión -> manda al login de Spring
      window.location.href = '/login';
      return of(false);
    })
  );
};

