import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { CookieStorageService } from '../cookie-service/cookie.service';
//import { SearchHeaderComponent } from 'src/app/modules_or_pages/layout/search-header/search-header.component';

export const authGuard: CanActivateFn = (route, state) => {

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

  return false;
};