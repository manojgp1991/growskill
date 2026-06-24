import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api-service/api.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactDto } from '../../../models/contact-filter/contact-filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { NumberOnly } from '../../../services/directive/number-only/number-only';
import { EmailOnly } from '../../../services/directive/email-only/email-only';

@Component({
  selector: 'app-add-contact-popup',
  imports: [CommonModule, FormsModule, NumberOnly, EmailOnly],
  templateUrl: './add-contact-popup.html',
  styleUrl: './add-contact-popup.css',
})
export class AddContactPopup implements OnInit {
  @Input() public data: string = '';
  contactModel: ContactDto = {
    id: 0,
    internal_code: '',
    name: '',
    email: '',
    phone: '',
    status: '',
    status_id: undefined,
    assignedTo: '',
    assignedTo_id: undefined,
    createdDate: '',
    company: ''
  };
  status: any[] = [];
  userList: any[] = [];
  submitted: boolean = false;
  cookieUserData: any = {};
  constructor(
    private _apiService: ApiService,
    private tostr: ToastrService,
    private activeModal: NgbActiveModal,
    private _cookieService: CookieStorageService,
    private _toaster: ApplicationToasterService
  ) {

  }
  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this.setContactForm(this.data);
  }
  setContactForm(oModel: any) {
    let data = JSON.parse(oModel);
    let obj: ContactDto = data?.contactDto ?? {};
    this.status = data?.status?.length > 0 ? data?.status : [];
    this.userList = data?.userList?.length > 0 ? data?.userList : [];

    this.contactModel.id = obj?.id ?? null,
      this.contactModel.name = obj?.name ?? '',
      this.contactModel.email = obj?.email ?? '',
      this.contactModel.phone = obj?.phone ?? '',
      this.contactModel.company = obj?.company ?? '',
      this.contactModel.status_id = obj?.status_id ?? 0,
      this.contactModel.assignedTo_id = obj?.assignedTo_id ?? 0
  }
  closeModel(data: any) {
    this.activeModal.dismiss(data);
  }
  onUpdateUser() {
    this.submitted = true;
    if(Number(this.contactModel.status_id)==0) {
        this._toaster.warning('Warning', 'Please select status.');
        return;
    } else if(Number(this.contactModel.assignedTo_id)==0) {
        this._toaster.warning('Warning', 'Please select assigned to.');
        return;
    } else {
      this.ApiCallSaveContacts();
    }
  }

  ApiCallSaveContacts() {
    let obj: any = this.contactModel;
    obj.sub_id = this.cookieUserData?.subcriptionId;
    obj.user_id = this.cookieUserData?.id;
    obj.action_type = 0;
    
    this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdateContact, obj, true).subscribe({
      next: (res: any) => {
        if (res.status) {
          this._toaster.success('Successful', 'Contact updated successfully.');
          this.closeModel('success');
        } else {
          this._toaster.error('', 'Failed to save contact information.');
        }

      },
      error: () => {
      }
    });
  }
}
