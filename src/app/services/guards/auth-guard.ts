import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieStorageService } from '../cookie-service/cookie.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const cookieService = inject(CookieStorageService);
  const modalService = inject(NgbModal);

  const token = cookieService.getToken();

  if (token) {
    return true;
  }

  modalService.dismissAll();

  // Existing logic
  // new SearchHeaderComponent(
  //   modalService,
  //   cookieService
  // ).openLoginPopup();
  
  //return false;
   return router.createUrlTree(['/login']);
};