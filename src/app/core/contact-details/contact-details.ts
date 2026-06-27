import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { Subscription } from 'rxjs';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { ContactDto } from '../../models/contact-filter/contact-filter';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { FormsModule } from '@angular/forms';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';

@Component({
  selector: 'app-contact-details',
  imports: [CommonModule, RouterLink, InitialsPipe, FormsModule],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.css',
})
export class ContactDetails implements OnInit {
  cookieUserData: any = {};
  contactDetailSubscription: Subscription | undefined;
  activitySubscription: Subscription | undefined;
  activityList: any[] = [];
  statusList: any[] = [];
  contactDetails: ContactDto = {
    id: 0,
    internal_code: '',
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    status_id: 0,
    assignedTo_id: 0,
    assignedTo: '',
    createdDate: ''
  };
  internal_code: any = '';
  statusIcons: string[] = [
    '🎯',
    '📞',
    '✅',
    '📄',
    '🏆',
    '❌'
  ];
  contactNote: string = '';
  tempConnetNote: string = '';
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
    private _activatedRoute: ActivatedRoute
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this.getModulePermissions();
    this._activatedRoute.queryParams.subscribe(params => {
      if (params['pdata']) {
        var data: any = JSON.parse(params['pdata']);
        if (data) {
          this.internal_code = data.internal_code;
          this.GetContactDetailsOnLoad();
          this.cdr.markForCheck();
        }
      }
    });
  }
  ngOnInit(): void {

  }

  GetContactDetailsOnLoad() {
    this.GetContactDetailsOnLoadApiCall(true);
  }
  GetContactDetailsOnLoadApiCall(isPageLoaderShow: boolean) {
    const payload = {
      internal_code: this.internal_code,
      sub_id: this.cookieUserData?.subcriptionId
    };
    if (this.contactDetailSubscription) {
      this.contactDetailSubscription.unsubscribe();
    }
    this.contactDetailSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetContactDetails, payload, isPageLoaderShow).subscribe({
        next: (res: any) => {
          debugger
          if (res.status) {
            if (res?.response?.length > 0) {
              this.activityList = res?.response[0]?.activityList ?? [];
              this.statusList = res?.response[0]?.StatusList ?? [];
              this.contactDetails = res?.response[0]?.contactDetails?.[0] ?? {};
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

  loadActivity() {
    this.GetContactDetailsOnLoadApiCall(true);
  }
  loadActivityApiCall(loadActivityApiCall: boolean) {
    const payload = {
      internal_code: this.internal_code,
      sub_id: this.cookieUserData?.subcriptionId
    };
    if (this.activitySubscription) {
      this.activitySubscription.unsubscribe();
    }
    this.activitySubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetContactActivities, payload, loadActivityApiCall).subscribe({
        next: (res: any) => {
          if (res.status) {
            if (res?.response?.length > 0) {
              this.activityList = res?.response[0]?.activityList ?? [];
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
  updateContactStatus(status: any) {
    const payload = {
      internal_code: this.internal_code,
      sub_id: this.cookieUserData?.subcriptionId,
      status_id: status?.id,
      user_id: this.cookieUserData?.id,
      comment: this.tempConnetNote ? this.tempConnetNote : ''
    };

    this._apiService.Post$(GrowSkillAPIEndPointPath.UpdateContactStatus, payload, true).subscribe({
      next: (res: any) => {
        debugger
        if (res.status) {
          this._toaster.success('', 'Status updated successfully.');
          this.contactNote = '';
          this.tempConnetNote = '';

          this.GetContactDetailsOnLoad();
          this.cdr.markForCheck();
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.cdr.markForCheck();
      }
    });
  }
  addCommentOnContact() {
    if (!this.contactNote) {
      this._toaster.warning('', 'Write a comment first.');
      return;
    } else {
      this.tempConnetNote = JSON.parse(JSON.stringify(this.contactNote.trim()));
      this.apiCallAddContactComment()
    }
  }
  apiCallAddContactComment() {
    const payload = {
      internal_code: this.internal_code,
      sub_id: this.cookieUserData?.subcriptionId,
      status_id: this.contactDetails?.status_id,
      user_id: this.cookieUserData?.id,
      comment: this.tempConnetNote ? this.tempConnetNote : ''
    };

    this.updateContactStatus(payload)
  }
  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
}
