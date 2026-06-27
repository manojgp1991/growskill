import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { MenuPermission, ReadWritePermission } from '../../models/loginUser/menuPermission';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
})
export class Settings implements OnInit {
    cookieUserData: any = {};
    actionPermission: ReadWritePermission = {
      readPermission: false,
      writePermission: false
    }       
    constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private _toaster: ApplicationToasterService,
    private _router: Router
  ) {debugger
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Settings');
    this.getActionPermissions();
  }
  ngOnInit(): void {
    
  }
    getActionPermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
}
