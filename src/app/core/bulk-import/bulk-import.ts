import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api-service/api.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { contactDtoResponse, CountactList } from '../../models/contactDtoResponse/contact-dto-response';
import { CommonModule } from '@angular/common';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';

@Component({
  selector: 'app-bulk-import',
  imports: [CommonModule, FormsModule],
  templateUrl: './bulk-import.html',
  styleUrl: './bulk-import.css',
})
export class BulkImport implements OnInit {
  bulkFilePath: string = 'assets/template/growskill_template.csv';
  selectedFile: File | null = null;
  result: contactDtoResponse | null = null;
  errorList: any[] = [];
  errorMessage = '';
  isUploading = false;
  tempImportsList: CountactList[] = [];
  private readonly allowedExtensions = ['.csv', '.xlsx', '.xls'];
  userList: any[] = [];
  status: any[] = [];
  cookieUserData: any = {};
  dropdownSubscription: Subscription | undefined;
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private _apiService: ApiService,
    private _toaster: ApplicationToasterService,
    private _cookieService: CookieStorageService,
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Bulk Import');
    this.getModulePermissions();
  }
  ngOnInit(): void {
    this.getDropdowns();
  }
  getDropdowns() {
    this.getDropdownsApiCall(true);
  }
  getDropdownsApiCall(isPageLoaderShow: boolean) {
    const payload = {
      sub_id: this.cookieUserData?.subcriptionId
    };
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
    this.dropdownSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetContactPageData, payload, true).subscribe({
        next: (res: any) => {
          if (res.status) {
            if (res?.response?.length > 0) {
              this.userList = res?.response[0]?.UserList ?? [];
              this.status = res?.response[0]?.StatusList ?? [];
            }
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        }
      });
  }

  downloadTemplate() {
    const csv = 'Name,Email,Phone,Company\nJohn Doe,john@example.com,+91 9000000000,Example Corp\nJane Smith,jane@example.com,+91 8000000000,Smith Ltd\n';
    const a = document.createElement('a');
    a.href = 'data:text/csv,' + encodeURIComponent(csv);
    a.download = 'growskill_contact_template.csv';
    a.click();
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    this.errorMessage = '';
    this.result = null;

    if (!file) return;

    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!this.allowedExtensions.includes(ext)) {
      this.errorMessage = 'Please select a .csv, .xlsx, or .xls file.';
      this._toaster.warning('Warning', this.errorMessage);
      return;
    }
    this.selectedFile = file;
    this.cdr.markForCheck();
    this.upload();
  }

  upload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('user_id', this.cookieUserData?.id);
    formData.append('sub_id', this.cookieUserData?.subcriptionId);

    this._apiService.PostImportFile$(GrowSkillAPIEndPointPath.GetImportContacts, formData, true).subscribe({
      next: (res) => {
        this.result = res;
        this.tempImportsList = this.result?.countactList ?? [];
        this.errorList = this.result?.errors ?? [];
        this.isUploading = false;
        this.cdr.markForCheck();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong during import.';
        this._toaster.warning('Warning', this.errorMessage);
        this.isUploading = false;
        this.cdr.markForCheck();
      }
    });
  }

  CancelImport(): void {
    this.selectedFile = null;
    this.result = null;
    this.tempImportsList = [];
    this.errorMessage = '';
    this.isUploading = false;
    this.cdr.markForCheck();
  }

  ClearlImport(): void {
    this.errorList = [];
    this.cdr.markForCheck();
  }

  processImport(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'No file selected for import.';
      this._toaster.warning('Warning', this.errorMessage);
      return;
    }

    this.isUploading = true;
    this.errorMessage = '';
    const obj = {
      sub_id: this.cookieUserData?.subcriptionId,
      user_id: this.cookieUserData?.id,
      contactList: this.tempImportsList
    };
    this._apiService.Post$(GrowSkillAPIEndPointPath.GetProcessImportContacts, obj, true).subscribe({
      next: (res) => {
        if (res.status) {
          this.result = res;
          this.tempImportsList = [];
          this.isUploading = false;
          this._toaster.success('Success', 'Contacts processed successfully.');
          this.cdr.markForCheck();
        }

      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error?.message ?? 'Something went wrong during processing import.';
        this._toaster.warning('Warning', this.errorMessage);
        this.isUploading = false;
        this.cdr.markForCheck();
      }
    });
  }
  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
}
