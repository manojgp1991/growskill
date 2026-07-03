import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-email-templates',
  imports: [RouterLink],
  templateUrl: './email-templates.html',
  styleUrl: './email-templates.css',
})
export class EmailTemplates implements OnInit {
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }
  cookieUserData: any = {};

  constructor(
    private _cookieService: CookieStorageService,
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Email Configuration');
     this.getModulePermissions();
  }
  ngOnInit(): void {
   
  }
  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
}
