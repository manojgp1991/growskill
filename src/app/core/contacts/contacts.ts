import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ContactDto, ContactFilter } from '../../models/contact-filter/contact-filter';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CommonModule } from '@angular/common';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddContactPopup } from '../popup/add-contact-popup/add-contact-popup';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, InitialsPipe, NgbModule],
  templateUrl: './contacts.html',
  styleUrl: './contacts.css',
})
export class Contacts implements OnInit {
  dropdownSubscription: Subscription | undefined;
  userList: any[] = [];
  status: any[] = [];
  filter = new ContactFilter();
  contacts: ContactDto[] = [];
  totalRecords = 0;
  totalPages = 0;
  isLoading = false;
  errorMessage = '';
  cookieUserData: any = {};

  private searchInput$ = new Subject<string>();
  private sub?: Subscription;
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
    private _router: Router
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Contacts');
    this.getModulePermissions();
  }
  ngOnInit(): void {
    this.filter.sub_id = this.cookieUserData?.subcriptionId;
    this.getDropdowns();
    this.sub = this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((text) => {
        this.filter.pageNumber = 1;
        this.loadContacts();
      });
    this.loadContacts();
  }
  onSearchChange(value: string): void {
    this.filter.searchText = value;
    this.searchInput$.next(value);
    this.cdr.markForCheck();
  }

  onStatusChange(value: number): void {
    this.filter.status = Number(value);
    this.filter.pageNumber = 1;
    this.cdr.markForCheck();
    this.loadContacts();
  }

  onAssigneeChange(value: number): void {
    this.filter.assignedTo = Number(value);
    this.filter.pageNumber = 1;
    this.cdr.markForCheck();
    this.loadContacts();
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.filter.pageNumber) return;
    this.filter.pageNumber = page;
    this.cdr.markForCheck();
    this.loadContacts();
  }

  loadContacts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this._apiService.Post$(GrowSkillAPIEndPointPath.GetContactByFilter, this.filter, false).subscribe({
      next: (res) => {
        if (res?.status) {
          if (res?.response?.contactList?.length > 0) {
            this.contacts = res?.response?.contactList ?? [];
            this.totalRecords = res?.response?.totalRecords;
            this.totalPages = res?.response?.totalPages;
            this.filter.pageNumber = res?.response?.pageNumber;
            this.filter.pageSize = res?.response?.pageSize;
            this.isLoading = false;
            this.cdr.markForCheck();
          } else {
            this.contacts = [];
            this.totalRecords = 0;
            this.totalPages = 0;
          }
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message ?? 'Failed to load contacts.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
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
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetContactPageData, payload, isPageLoaderShow).subscribe({
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
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  trackByContact(index: number, user: any): string {
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
  exportContacts(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this._apiService.PostApiExcelExport$(GrowSkillAPIEndPointPath.GetExportContacts, this.filter, false, 'blob')
      .subscribe({
        next: (response: Blob) => {
          const blob = new Blob([response], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `Contacts_${new Date().getTime()}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Export failed', err);
          this.isLoading = false;
        }
      });
  }
  openAddContact(contact: any) {
    const modalRef = this.modalService.open(AddContactPopup,
      { centered: true, backdrop: 'static', keyboard: false, size: 'md', windowClass: "modal fade modal-overlay" }
    );
    let obj = {
      status: this.status,
      userList: this.userList,
      contactDto: contact
    }
    modalRef.componentInstance.data = JSON.stringify(obj);
    modalRef.result.then(res => {
    }, (data: any) => {
      if (data == 'success') { this.loadContacts(); }
    })
  }

  confirmDeleteContact(contact: any) {
    if (confirm('Are you sure you want to delete this contact?')) {
      this.ApiCallSaveContacts(contact);
    }
  }
  ApiCallSaveContacts(data: any) {
    let obj: any = {};
    obj.id = data?.id ?? 0;
    obj.sub_id = this.cookieUserData?.subcriptionId;
    obj.user_id = this.cookieUserData?.id;
    obj.action_type = -1;

    this._apiService.Post$(GrowSkillAPIEndPointPath.GetUpdateContact, obj, true).subscribe({
      next: (res: any) => {

         if (res.status) {
          const result = res?.response ?? {};
          if (result?.code == 'success') {
            this._toaster.success('', res?.response?.message ?? 'Contact removed successfully.');
          } else if (result?.code == 'error') {
            this._toaster.error('', res?.response?.message ?? 'Invalid contact information.');
          }
           this.loadContacts();
           this.cdr.markForCheck();
        } else {
          this._toaster.error('', res?.response?.message ?? 'Failed to removed contact.');
        }

        // if (res.status) {
        //   this._toaster.success('Successful', 'Contact removed successfully.');
        //   this.loadContacts();
        //   this.cdr.markForCheck();
        // } else {
        //   this._toaster.error('', 'Failed to removed contact.');
        // }

      },
      error: () => {
      }
    });
  }
  openContactDetail($event: any) {
    var clickedContact: any = $event;
    let pdata = {
      internal_code: clickedContact.internal_Code
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "pdata": JSON.stringify(pdata)
      }
    };
    this._router.navigate(['contacts-details'], navigationExtras);
  }

  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
}
