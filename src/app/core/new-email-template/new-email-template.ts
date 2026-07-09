import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';
import { CommonModule } from '@angular/common';
import { EmailTemplateModel } from '../../models/emailTemplate/emailTemplate';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api-service/api.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-new-email-template',
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './new-email-template.html',
  styleUrl: './new-email-template.css',
})
export class NewEmailTemplate implements OnInit, OnDestroy {
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }
  cookieUserData: any = {};
  emailTemplateModel: EmailTemplateModel = {
    id: 0,
    sub_id: '',
    user_id: 0,
    email_action_id: 0,
    internal_code: '',
    template_name: '',
    email_body: '',
    is_active: true,
    action_type: 0,
    createdDate: ''
  }
  internal_code: any = '';
  TemplateSubscription: Subscription | undefined;
  actionList: any[] =[];

  constructor(
    private _cookieService: CookieStorageService,
    private _apiService: ApiService,
    private _toaster: ToastrService,
    private _activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Email Configuration');
     this._activatedRoute.queryParams.subscribe(params => {
      if (params['pdata']) {
        var data: any = JSON.parse(params['pdata']);
        if (data) {
          this.internal_code = data.internal_code;
          this.GetTemplateOnLoad();
          this.cdr.markForCheck();
        }
      }
    });
  }
  html = '';
  editor!: Editor;
  submitted: boolean = false;
  ngOnInit(): void {
    this.editor = new Editor();
    this.getModulePermissions();
  }

  getModulePermissions() {
    this.cookieUserData = this._cookieService.getUser();
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
  onUpdateTemplate() {
    if(Number(this.emailTemplateModel.email_action_id)==0) {
      this._toaster.error('Error', 'Please select an email action.');
      return;
    } else {
    this.submitted = true;
    this.ApiCallSaveUser();
    }
  }

  ApiCallSaveUser() {
    this.emailTemplateModel.sub_id = this.cookieUserData?.subcriptionId;
    this.emailTemplateModel.user_id = this.cookieUserData?.id;
    this.emailTemplateModel.action_type = 0;
    this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdateEmailTemplate, this.emailTemplateModel, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          const result = res?.response ?? {};
          if (result?.code == 'success') {
            this._toaster.success('Successfull', res?.response?.message ?? 'Email template saved successfully.');
            this.emailTemplateModel = {
              id: 0,
              sub_id: '',
              user_id: 0,
              email_action_id: 0,
              internal_code: '',
              template_name: '',
              email_body: '',
              is_active: true,
              action_type: 0,
              createdDate: ''
            }
            this.submitted = false;
            this.router.navigate(['/email-templates']);
          } else if (result?.code == 'duplicate') {
            this._toaster.error('', res?.response?.message ?? 'Email template already exists in system.');
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid email template.');
          }
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to save email template.');
        }

      },
      error: () => {
      }
    });
  }
  GetTemplateOnLoad() {
    this.GetTemplateOnLoadApiCall(true);
  }
  GetTemplateOnLoadApiCall(isPageLoaderShow: boolean) {
    const payload = {
      sub_id: this.cookieUserData?.subcriptionId,
      internal_code: this.internal_code
    };
    if (this.TemplateSubscription) {
      this.TemplateSubscription.unsubscribe();
    }
    this.TemplateSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetEmailTemplates, payload, isPageLoaderShow).subscribe({
        next: (res: any) => {
          if (res.status) {
            if (res?.response?.templates) {
              const template : EmailTemplateModel=  res?.response?.templates ?? {};
              this.actionList = res?.response?.actionList ?? [];
              this.emailTemplateModel = {
                id: template.id,
                sub_id: template.sub_id,
                user_id: this.cookieUserData.id,
                email_action_id: template.email_action_id,
                internal_code: this.internal_code,
                template_name: template.template_name,
                email_body: template.email_body,
                is_active: template.is_active,
                action_type: 0,
                createdDate:''
              }
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
}
