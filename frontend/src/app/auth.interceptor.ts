import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401) {
        const isOnLogin = router.url.startsWith('/login');
        const isAuthCheck = req.url.endsWith('/api/auth/me');
        const isLoginCall = req.url.endsWith('/login');
        const isLogoutCall = req.url.endsWith('/logout');

        // 👉 solo redirigimos si NO estamos en login
        // y si la petición NO era /api/auth/me, NI /login, NI /logout
        if (!isOnLogin && !isAuthCheck && !isLoginCall && !isLogoutCall) {
          router.navigate(['/login'], {
            queryParams: { returnUrl: router.url },
          });
        }
      }
      return throwError(() => err);
    }),
  );
};

