import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { Subscription } from 'rxjs';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { ApiService } from '../../services/api-service/api.service';
import { EmailTemplateModel } from '../../models/emailTemplate/emailTemplate';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-email-templates',
  imports: [RouterLink, CommonModule],
  templateUrl: './email-templates.html',
  styleUrl: './email-templates.css',
})
export class EmailTemplates implements OnInit {
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }
  cookieUserData: any = {};
  TemplateSubscription: Subscription | undefined;
  templates: EmailTemplateModel[] = [];

  constructor(
    private _cookieService: CookieStorageService,
    private _apiService: ApiService,
    private cdr: ChangeDetectorRef,
    private _router: Router
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Email Configuration');
    this.getModulePermissions();
  }
  ngOnInit(): void {
    this.GetTemplateOnLoad();
  }
  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
  GetTemplateOnLoad() {
    this.GetTemplateOnLoadApiCall(true);
  }
  GetTemplateOnLoadApiCall(isPageLoaderShow: boolean) {debugger
    const payload = {
      sub_id: this.cookieUserData?.subcriptionId,
      internal_code: ''
    };
    if (this.TemplateSubscription) {
      this.TemplateSubscription.unsubscribe();
    }
    this.TemplateSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetEmailTemplates, payload, isPageLoaderShow).subscribe({
        next: (res: any) => {debugger
          if (res.status) {
            if (res?.response?.templates?.length > 0) {
              this.templates = res?.response?.templates ?? [];
              this.cdr.markForCheck();
            }
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        }
      });
  }

  openTemplateDetail($event: any) {
    var clickedContact: any = $event;
    let pdata = {
      internal_code: clickedContact.internal_code
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "pdata": JSON.stringify(pdata)
      }
    };
    this._router.navigate(['new-email-template'], navigationExtras);
  }
}
