import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-sidepannel',
  imports: [RouterLink, Footer],
  templateUrl: './sidepannel.html',
  styleUrl: './sidepannel.css',
})
export class Sidepannel implements OnInit {
    cookieUserData: any = {};
  
    constructor(private _cookieService: CookieStorageService) { }
    ngOnInit(): void {
       this.cookieUserData = this._cookieService.getUser();
    }
}
