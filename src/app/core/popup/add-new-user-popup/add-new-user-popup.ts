import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ContactDto } from '../../../models/contact-filter/contact-filter';
import { ApiService } from '../../../services/api-service/api.service';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { addUserModel } from '../../../models/loginUser/loginUser';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmailOnly } from '../../../services/directive/email-only/email-only';

@Component({
  selector: 'app-add-new-user-popup',
  imports: [CommonModule, FormsModule, EmailOnly],
  templateUrl: './add-new-user-popup.html',
  styleUrl: './add-new-user-popup.css',
})
export class AddNewUserPopup {
  @Input() public data: string = '';
  userModel: addUserModel = {
    id: 0,
    user_id: 0,
    sub_id: '',
    name: '',
    email: '',
    password: '',
    role_id: 0,
    actionType: 0
  };
  userRoles: any[] = [];
  submitted: boolean = false;
  cookieUserData: any = {};
  userLogSubscription: Subscription | undefined;
  headerText: string = 'Add New User';

  constructor(
    private _apiService: ApiService,
    private tostr: ToastrService,
    private activeModal: NgbActiveModal,
    private _cookieService: CookieStorageService,
    private _toaster: ApplicationToasterService,
    private cdr: ChangeDetectorRef,
  ) {

  }
  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this.setContactForm(this.data);
  }
  setContactForm(oModel: any) {
    let data = JSON.parse(oModel);
    let obj: addUserModel = data?.userData ?? {};
    this.userRoles = data?.RoleList ?? [];

    this.userModel = {
      id: obj?.id ?? 0,
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId,
      name: obj?.name ?? '',
      email: obj?.email ?? '',
      password: obj?.password ?? '',
      role_id: obj?.role_id ?? 0,
      actionType: obj?.actionType ?? 0,
    }
    this.headerText = this.userModel.id == 0 ? 'Add New User' : 'Update User'
  }

  closeModel(data: any) {
    this.activeModal.dismiss(data);
  }
  onUpdateUser() {
    this.submitted = true;
    if (Number(this.userModel.role_id) == 0) {
      this._toaster.warning('Warning', 'Please select role.');
      return;
    } else {
      this.ApiCallSaveUser();
    }
  }

  ApiCallSaveUser() {
    this.userModel.sub_id = this.cookieUserData?.subcriptionId;
    this.userModel.user_id = this.cookieUserData?.id;
    this.userModel.actionType = 0;

    this._apiService.Post$(GrowSkillAPIEndPointPath.UpdateUser, this.userModel, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          const result = res?.response ?? {};
          if (result?.code == 'success') {
            this._toaster.success('Successfull', res?.response?.message ?? 'User information saved successfully.');
            this.closeModel('success');
          } else if (result?.code == 'duplicate') {
            this._toaster.error('', res?.response?.message ?? 'user information already exists in system.');
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid user information.');
          }
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to save user information.');
        }

      },
      error: () => {
      }
    });
  }
}
