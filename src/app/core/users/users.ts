import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CommonModule } from '@angular/common';
import { AddNewUserPopup } from '../popup/add-new-user-popup/add-new-user-popup';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { addUserModel } from '../../models/loginUser/loginUser';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';

@Component({
  selector: 'app-users',
  imports: [CommonModule, InitialsPipe], //
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  userbyRoleSubscription: Subscription | undefined;
  cookieUserData: any = {};
  userRoles: any[] = [];
  totalUserCount: number = 0;
  avatarGradients: string[] = [
    'linear-gradient(135deg,#00C8A0,#0099CC)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    'linear-gradient(135deg,#EC4899,#BE185D)'
  ];
  roleGradients = [
    'badge badge-sales',
    'badge badge-viewer',
    'badge badge-admin',
    'badge badge-superadmin'
  ];
  RoleSubscription: Subscription | undefined;
  RoleList: any[] = [];
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
  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private _toaster: ApplicationToasterService,
  ) { }

  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('User Management');
    this.getUsersByRole()
    this.getRoleList(true);
  }

  getUsersByRole() {
    this.getUsersByRoleAPICall(true);
  }
  getUsersByRoleAPICall(isPageLoaderShow: boolean) {
    const payload = {
      sub_id: this.cookieUserData?.subcriptionId,
    };
    if (this.userbyRoleSubscription) {
      this.userbyRoleSubscription.unsubscribe();
    }
    this.userbyRoleSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetUserByRole, payload, true).subscribe({
        next: (res: any) => {
          if (res.status) {

            if (res?.response?.length > 0) {
              this.userRoles = res?.response ?? [];
              this.totalUserCount = this.userRoles?.length ?? 0;
            }
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.cdr.markForCheck();
        }
      });
  }
  trackByRole(index: number, user: any): string {
    return user?.id ?? index;
  }
  getAvatarStyle(index: number) {
    return {
      width: '38px',
      height: '38px',
      fontSize: '.78rem',
      background: this.avatarGradients[index % this.avatarGradients.length]
    };
  }
  getRoleList(isPageLoaderShow: boolean) {
    this.getRoleAPICall(isPageLoaderShow);
  }
  getRoleAPICall(isPageLoaderShow: boolean) {
    if (this.RoleSubscription) {
      this.RoleSubscription.unsubscribe();
    }
    this.RoleSubscription = this._apiService
      .Get$(GrowSkillAPIEndPointPath.UserRoles, isPageLoaderShow)
      .subscribe(
        (res) => {
          let result: any = res;
          if (result.status) {
            this.RoleList = result?.response ?? [];
            this.cdr.markForCheck();
          }
        },
        (err) => { }
      );
  }
  openAddNewUserPopup(userData: any) {
    const modalRef = this.modalService.open(AddNewUserPopup,
      { centered: true, backdrop: 'static', keyboard: false, size: 'md', windowClass: "modal fade modal-overlay" }
    );
    let obj = {
      RoleList: this.RoleList,
      userData: userData
    }
    modalRef.componentInstance.data = JSON.stringify(obj);
    modalRef.result.then(res => {
    }, (data: any) => {
      if (data == 'success') { this.getUsersByRole(); }
    })
  }

  onUserRemove(user: any) {
     if (confirm('Are you sure you want to delete this user?')) {
      this.ApiCallSaveDeleteUser(user);
    }
  }

  ApiCallSaveDeleteUser(user: any) {
    this.userModel.sub_id = this.cookieUserData?.subcriptionId;
    this.userModel.user_id = this.cookieUserData?.id;
    this.userModel.role_id = this.cookieUserData?.role_id;
    this.userModel.id = user?.id;
    this.userModel.actionType = -1;

    this._apiService.Post$(GrowSkillAPIEndPointPath.UpdateUser, this.userModel, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          const result = res?.response ?? {};
          if (result?.code == 'success') {
            this._toaster.success('', res?.response?.message ?? 'User removed successfully.');
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid user information.');
          }
           this.getUsersByRole();
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to removed user.');
        }

      },
      error: () => {
      }
    });
  }

}
