import {
  HttpInterceptorFn,
  HttpResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs/operators';

import { PageLoaderService } from '../../page.loader.service/page.loader.service';

let activeRequests: any[] = [];

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(PageLoaderService);
  const removeRequest = (request: any) => {
    const index = activeRequests.indexOf(request);
    if (index >= 0) {
      activeRequests.splice(index, 1);
    }
    loaderService.isLoading.next(activeRequests.length > 0);
  };
  const showLoader =
    req.headers.get('IsShowPageLoader') === 'true';
  if (!showLoader) {
    return next(req);
  }
  activeRequests.push(req);
  loaderService.isLoading.next(true);
  loaderService.loadingText.next(
    req.headers.get('LoaderText') || ''
  );
  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        removeRequest(req);
      }
    }),
    finalize(() => {
      removeRequest(req);
    })
  );
};