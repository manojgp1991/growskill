import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { LoggedInUser } from '../../models/loginUser/loginUser';
import { MenuPermission } from '../../models/loginUser/menuPermission';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidepannel',
  imports: [RouterLink, Footer, RouterModule, CommonModule],
  templateUrl: './sidepannel.html',
  styleUrl: './sidepannel.css',
})
export class Sidepannel implements OnInit {
  cookieUserData: LoggedInUser = {
    Id: 0,
    SubcriptionId: '',
    RoleId: 0,
    RoleName: '',
    InternalCode: '',
    Name: '',
    Email: '',
    AllowLogin: false,
    role: [],
    moduleAccess: [],
    permissions: []
  };
  menuPermissions: MenuPermission = {
    dashboard: false,
    contacts: false,
    pipeline: false,
    bulkImport: false,
    userManagement: false,
    settings: false,
  }
  constructor(private _cookieService: CookieStorageService) { }
  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this.getModulePermissions();
  }

  getModulePermissions() {
    this.menuPermissions = {
      dashboard: this._cookieService.hasModuleAccess('Dashboard'),
      contacts: this._cookieService.hasModuleAccess('Contacts'),
      pipeline: this._cookieService.hasModuleAccess('Pipeline'),
      bulkImport: this._cookieService.hasModuleAccess('Bulk Import'),
      userManagement: this._cookieService.hasModuleAccess('User Management'),
      settings: this._cookieService.hasModuleAccess('Settings'),
    };
  }

}
