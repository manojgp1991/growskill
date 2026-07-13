// import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
// import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
// import { ToastrService } from 'ngx-toastr';
// import { ApiService } from '../../../services/api-service/api.service';
// import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
// import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';

// @Component({
//   selector: 'app-add-new-subscriptions',
//   imports: [],
//   templateUrl: './add-new-subscriptions.html',
//   styleUrl: './add-new-subscriptions.css',
// })
// export class AddNewSubscriptions implements OnInit {
//   constructor(
//         private _apiService: ApiService,
//     private tostr: ToastrService,
//     private activeModal: NgbActiveModal,
//     private _cookieService: CookieStorageService,
//     private _toaster: ApplicationToasterService,
//     private cdr: ChangeDetectorRef,
//   ) { }

//   ngOnInit(): void {
//   }
//     closeModel(data: any) {
//     this.activeModal.dismiss(data);
//   }
// }



import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../../services/api-service/api.service';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { Subscription } from 'rxjs';
import { NumberOnly } from '../../../services/directive/number-only/number-only';
import { EmailOnly } from '../../../services/directive/email-only/email-only';

export class SubscriptionModel {
  company_name: string = '';
  email: string = '';
  phone: string = '';
  contact_person: string = '';
  gst_number: string = '';
  address: string = '';
  allow_users: number | null = null;
  start_date: string = '';
  valid_till: string = '';
}

@Component({
  selector: 'app-add-new-subscriptions',
  imports: [CommonModule, FormsModule, NumberOnly, EmailOnly],
  templateUrl: './add-new-subscriptions.html',
  styleUrl: './add-new-subscriptions.css',
})
export class AddNewSubscriptions implements OnInit {

  model: SubscriptionModel = new SubscriptionModel();
  isSubmitting: boolean = false;
  cookieUserData: any = {};
  private apiSub?: Subscription;

  constructor(
    private _apiService: ApiService,
    private tostr: ToastrService,
    private activeModal: NgbActiveModal,
    private _cookieService: CookieStorageService,
    private _toaster: ApplicationToasterService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
  }

  ngOnDestroy(): void {
    this.apiSub?.unsubscribe();
  }

  // ── Validate ──────────────────────────────────────────────
  isDateRangeInvalid(): boolean {
    if (!this.model.start_date || !this.model.valid_till) return false;
    return new Date(this.model.valid_till) <= new Date(this.model.start_date);
  }

  // ── Submit ────────────────────────────────────────────────
  onSave(form: any): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.isDateRangeInvalid()) {
      this._toaster.error('', 'Valid Till date must be after Start Date.');
      return;
    }

    this.isSubmitting = true;

    const payload = {
      user_id: this.cookieUserData?.id,
      company_name: this.model.company_name,
      email: this.model.email,
      phone: this.model.phone,
      contact_person: this.model.contact_person,
      gst_number: this.model.gst_number?.toUpperCase(),
      address: this.model.address,
      allow_users: this.model.allow_users,
      subscription_date: this.model.start_date,
      subscription_valid_till: this.model.valid_till,
      action_type: 0
    };

    this.apiSub = this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdateSubscription, payload, true).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res?.status) {
          if (res?.response?.code == 'success') {
            this._toaster.success('', res?.message ?? 'Subscription added successfully.');
            this.closeModel('success');
          } else if (res?.response?.code == 'duplicate') {
            this._toaster.error('', res?.response?.message ?? 'Something went wrong.');
          } else {
            this._toaster.error('', res?.response?.message ?? 'Something went wrong.');
          }
        } else {
          this._toaster.error('', res?.response?.message ?? 'Something went wrong.');
        }
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting = false;
        this._toaster.error('', 'Something went wrong. Please try again.');
        this.cdr.markForCheck();
      }
    });
  }

  closeModel(data: any): void {
    this.activeModal.dismiss(data);
  }
}