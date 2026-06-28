import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../services/api-service/api.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

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


@Component({
  selector: 'app-system-configurations',
  imports: [CommonModule, FormsModule],
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

  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private _toaster: ToastrService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
  }

  switchTab(tabName: string): void {
    this.activeTab = tabName;
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
          if (result?.code == 'success') {
             this._toaster.success('', res?.response?.message ?? 'Company details updated successfully.');
            this.submitted = false;
          }  else if (result?.code == 'error') {
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
}
