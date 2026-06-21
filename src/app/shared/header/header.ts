import { Component, OnInit } from '@angular/core';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
   cookieUserData: any = {};

  constructor(private _cookieService: CookieStorageService) { }
  ngOnInit(): void {
     this.cookieUserData = this._cookieService.getUser();
  }

}
