import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api-service/api.service';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { AddNewSubscriptions } from '../add-new-subscriptions/add-new-subscriptions';
import { SubscriptionFilter } from '../../../models/subscription-filter/subscription-filter';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { CommonModule } from '@angular/common';
import { InitialsPipe } from '../../../services/pipe/initials-pipe';

@Component({
  selector: 'app-manage-subscriptions',
  imports: [CommonModule, InitialsPipe],
  templateUrl: './manage-subscriptions.html',
  styleUrl: './manage-subscriptions.css',
})
export class ManageSubscriptions implements OnInit {
  filter = new SubscriptionFilter();
  private searchInput$ = new Subject<string>();
  private sub?: Subscription;
  errorMessage = '';
  totalRecords = 0;
  totalPages = 0;
  subscriptionList: any[] = [];
  statusList: any[] = [
    { id: -1, name: 'All' },
    { id: 1, name: 'Active' },
    { id: 2, name: 'Expiring Soon' },
    { id: 3, name: 'Expired' }
  ];
    cookieUserData: any = {};
avatarColors = [
  { bg: '#00C8A022', color: '#00C8A0' },
  { bg: '#3B82F622', color: '#3B82F6' },
  { bg: '#F59E0B22', color: '#F59E0B' },
  { bg: '#EF444422', color: '#EF4444' }
];
  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private _toaster: ApplicationToasterService,
  ) {
      this.cookieUserData = this._cookieService.getUser();
      this.filter.role_id = this.cookieUserData?.roleId ?? 0;
      this.filter.internal_code = this.cookieUserData?.internalCode ?? '';
  }
  ngOnInit(): void {
    this.sub = this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((text) => {
        this.filter.pageNumber = 1;
        this.loadSubscription();
      });
    this.loadSubscription();
  }
getAvatarColor(index: number) {
  return this.avatarColors[index % this.avatarColors.length];
}
  loadSubscription(): void {
    this.errorMessage = '';
    this._apiService.Post$(GrowSkillAPIEndPointPath.GetSubscriptions, this.filter, true).subscribe({
      next: (res) => {
        if (res?.status) {
          if (res?.response?.SubscriptionList?.length > 0) {
            this.subscriptionList = res?.response?.SubscriptionList ?? [];
            this.totalRecords = res?.response?.totalRecords;
            this.totalPages = res?.response?.totalPages;
            this.filter.pageNumber = res?.response?.pageNumber;
            this.filter.pageSize = res?.response?.pageSize;
            this.cdr.markForCheck();
          } else {
            this.subscriptionList = [];
            this.totalRecords = 0;
            this.totalPages = 0;
          }
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Failed to load contacts.';
        this.cdr.markForCheck();
      }
    });
  }
  onStatusChange(value: number): void {
    this.filter.status = Number(value);
    this.filter.pageNumber = 1;
    this.cdr.markForCheck();
    this.loadSubscription();
  }
  onSearchChange(value: string): void {
    this.filter.searchText = value;
    this.searchInput$.next(value);
    this.cdr.markForCheck();
  }
  openAddNewSubscriptionsPopup(userData: any) {
    const modalRef = this.modalService.open(AddNewSubscriptions,
      { centered: true, backdrop: 'static', keyboard: false, size: 'xl', windowClass: "modal fade" }
    );
    let obj = {
      RoleList: '',//this.RoleList,
      userData: userData
    }
    modalRef.componentInstance.data = JSON.stringify(obj);
    modalRef.result.then(res => {
    }, (data: any) => {
      if (data == 'success') {
            this.cdr.markForCheck();
            this.loadSubscription();
      }
    })
  }
}
