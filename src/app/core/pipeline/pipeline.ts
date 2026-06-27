import { Component, OnInit } from '@angular/core';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-pipeline',
  imports: [],
  templateUrl: './pipeline.html',
  styleUrl: './pipeline.css',
})
export class Pipeline implements OnInit {
  cookieUserData: any = {};
  constructor(
        private _cookieService: CookieStorageService,
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Pipeline');
  }
  ngOnInit(): void {
   
  }
}
