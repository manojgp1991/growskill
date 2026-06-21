import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { CookieStorageService } from '../../cookie-service/cookie.service';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {

  const cookieStorageService = inject(CookieStorageService);

  const token = cookieStorageService.getToken();

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {
        cookieStorageService.clearAllCookies();
        location.replace(window.location.origin);
      }

      return throwError(() => error);
    })
  );
};