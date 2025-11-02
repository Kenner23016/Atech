import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        // ruta actual en la que ESTÁ el usuario
        const isOnLogin = router.url.startsWith('/login');

        // petición que falló
        const isAuthCheck = req.url.endsWith('/api/auth/me');
        const isLoginCall = req.url.endsWith('/login');

        // 👉 solo redirigimos si:
        // - no estamos ya en /login
        // - y la petición que falló NO es el "checa si estoy logueado"
        // - y la petición que falló NO es el propio /login
        if (!isOnLogin && !isAuthCheck && !isLoginCall) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
        }
      }
      return throwError(() => err);
    }),
  );
};

