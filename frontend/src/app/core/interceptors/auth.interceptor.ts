import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service.ts';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  const isApi = req.url.includes('/api/');
  const isPublic =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/public/');

  let outgoing = req;
  if (token && isApi && !isPublic) {
    outgoing = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(outgoing).pipe(
    catchError((err) => {
      if (err.status === 401 && isApi && !req.url.includes('/auth/login')) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
