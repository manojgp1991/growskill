import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer implements OnInit {

  cookieUserData: any = {};

  constructor(private _cookieService: CookieStorageService, private router: Router) { }
  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
  }

  logOut() {
    this._cookieService.clearAllCookies();
    this.router.navigate(['/login']);
  }
}
