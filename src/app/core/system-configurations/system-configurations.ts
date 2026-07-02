import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api-service/api.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddPipeline } from '../popup/add-pipeline/add-pipeline';

export class CompanyModel {
  companyName: string = '';
  companySlogan: string = '';
  website: string = '';
  email: string = '';
  contactPerson: string = '';
  phone: string = '';
  gstNo: string = '';
  address: string = '';
}

export class passwordChangeModel {
  user_id: number = 0;
  sub_id: string = '';
  name: string = '';
  email: string = '';
  newPassword: string = '';
  confirmPasword: string = '';
}

@Component({
  selector: 'app-system-configurations',
  imports: [CommonModule, FormsModule, InitialsPipe],
  templateUrl: './system-configurations.html',
  styleUrl: './system-configurations.css',
})

export class SystemConfigurations implements OnInit {
  companyModel: CompanyModel = new CompanyModel();
  submitted = false;
  cookieUserData: any = {};
  activeTab = 'company';
  companyLogoFile: any = '';
  companyLogoPreviewUrl: any = '';
  errorMessage = '';
  loadSystemConfigSubscription: Subscription | undefined;
  pipeLineStages: any[] = [];
  userDetails: any = {};
  localLogourl: string = 'assets/images/logo.png';
  changePasswordModel: passwordChangeModel = new passwordChangeModel();
  submittedResetPass = false;
  passwordMismatch = false;
  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private _toaster: ToastrService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this.loadSystemConfig(true);
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }
  loadSystemConfig(isPageLoaderShow: boolean) {
    const payload = {
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId
    };
    if (this.loadSystemConfigSubscription) {
      this.loadSystemConfigSubscription.unsubscribe();
    }
    this.loadSystemConfigSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetCompanyProfile, payload, isPageLoaderShow).subscribe({
        next: (res: any) => {
          if (res.status) {
            if (res?.response) {
              const result = res?.response ?? {};
              this.pipeLineStages = result?.statusList ?? [];
              this.userDetails = result?.userDetails ?? {};
              const companyProfile = result?.companyProfile ?? {};
              this.mapCompanyProfile(companyProfile);
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
  mapCompanyProfile(model: any) {
    this.companyModel = {
      companyName: model?.company_name,
      companySlogan: model?.slogan,
      website: model?.websiteUrl,
      email: model?.email,
      contactPerson: model?.contact_person,
      phone: model?.phone,
      gstNo: model?.gst_number,
      address: model?.address,
    }
    this.companyLogoPreviewUrl = model?.logo ?? this.localLogourl;
    this.changePasswordModel = {
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId,
      name: this.userDetails?.name,
      email: this.userDetails?.email,
      newPassword: '',
      confirmPasword: ''
    }
    this.cdr.markForCheck();
  }
  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    const allowedTypes = ['image/png', 'image/jpeg'];
    if (!allowedTypes.includes(file.type)) {
      this._toaster.warning('', 'Only PNG or JPG files are allowed.');
      return;
    }
    const maxSizeInMB = 2;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      this._toaster.warning('', `File size should not exceed ${maxSizeInMB}MB.`);
      return;
    }
    this.companyLogoFile = file;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.companyLogoPreviewUrl = e.target.result;
      this.cdr.markForCheck();
    };
    reader.readAsDataURL(file);
    this.upload();
    input.value = '';
  }
  upload(): void {
    if (!this.companyLogoFile) return;
    this.errorMessage = '';
    const formData = new FormData();
    formData.append('logoFile', this.companyLogoFile);
    formData.append('user_id', this.cookieUserData?.id);
    formData.append('sub_id', this.cookieUserData?.subcriptionId);

    this._apiService.PostImportFile$(GrowSkillAPIEndPointPath.GetUploadCompanyLogo, formData, true).subscribe({
      next: (res) => {
        var result = res?.response ?? {};
        if (result?.code == 'success') {
          this.errorMessage = result?.message ?? 'Company logo uploaded successfully.';
          this._toaster.success('Warning', this.errorMessage);
          this.cdr.markForCheck();
        } else {
          this.errorMessage = result?.message ?? 'Something went wrong during logo upload.';
          this._toaster.warning('Warning', this.errorMessage);
          this.cdr.markForCheck();
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong during logo upload.';
        this._toaster.warning('Warning', this.errorMessage);
        this.cdr.markForCheck();
      }
    });
  }
  onSaveCompany(form: NgForm): void {
    this.submitted = true;

    if (form.invalid) {
      return;
    }

    this.ApiCallSaveCompany();
  }
  ApiCallSaveCompany(): void {
    let obj: any = this.companyModel;
    obj.sub_id = this.cookieUserData?.subcriptionId;
    obj.user_id = this.cookieUserData?.id;

    this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdateCompanyProfile, obj, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          const result = res?.response ?? {};
          this.cdr.markForCheck();
          if (result?.code == 'success') {
            this._toaster.success('', res?.response?.message ?? 'Company details updated successfully.');
            this.submitted = false;
            this.mapCompanyProfile(result?.result);
            this.cdr.markForCheck();
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid company information.');
          }
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to save company information.');
        }
      },
      error: () => {
        this._toaster.error('', 'Something went wrong while saving company information.');
      }
    });
  }

  onResetPassword(form: NgForm): void {
    this.submittedResetPass = true;

    // Check password match only if either field has a value
    this.passwordMismatch =
      (!!this.changePasswordModel.newPassword || !!this.changePasswordModel.confirmPasword) &&
      this.changePasswordModel.newPassword !== this.changePasswordModel.confirmPasword;

    if (form.invalid || this.passwordMismatch) {
      return;
    }

    this.ApiCallResetPassword();
  }
  ApiCallResetPassword(): void {
    let obj: any = this.changePasswordModel;
    obj.sub_id = this.cookieUserData?.subcriptionId;
    obj.user_id = this.cookieUserData?.id;

    this._apiService.Post$(GrowSkillAPIEndPointPath.UpdatePassword, obj, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          const result = res?.response ?? {};
          this.changePasswordModel.newPassword = '';
          this.changePasswordModel.confirmPasword = '';
          this.cdr.markForCheck();
          if (result?.code == 'success') {
            this._toaster.success('', res?.response?.message ?? 'User details updated successfully.');
            this.submittedResetPass = false;
               this.cdr.markForCheck();
            this.changePasswordModel = {
              user_id: this.cookieUserData?.id,
              sub_id: this.cookieUserData?.this.cookieUserData?.subcriptionId,
              name: result?.userDetails?.name,
              email: result?.userDetails?.email,
              newPassword: '',
              confirmPasword: ''
            }

            this.cdr.markForCheck();
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid user information.');
          }
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to save user information.');
        }
      },
      error: () => {
        this._toaster.error('', 'Something went wrong while saving user information.');
      }
    });

  }
  openAddContact(pipeLineModel: any) {
      const modalRef = this.modalService.open(AddPipeline,
        { centered: true, backdrop: 'static', keyboard: false, size: 'md', windowClass: "modal fade modal-overlay" }
      );
      let obj = {
        pipipeLineData: pipeLineModel?? {},
      }
      modalRef.componentInstance.data = JSON.stringify(obj);
      modalRef.result.then(res => {
      }, (data: any) => {
        if (!(data=='close')) { 
           this.cdr.markForCheck();
           const tempPipeline = JSON.parse(JSON.stringify(this.pipeLineStages));
           this.pipeLineStages = data?.length > 0 ? data : tempPipeline;
          this.cdr.markForCheck();
        }
      })
    }
}
