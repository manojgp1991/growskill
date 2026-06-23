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
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacts',
  imports: [CommonModule, InitialsPipe, NgbModule, RouterLink],
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
  constructor(private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {

  }
  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
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
      contactDto : contact
    }
    modalRef.componentInstance.data = JSON.stringify(obj);
    modalRef.result.then(res => {
    }, (data:any) => {
      if(data=='success') { this.loadContacts(); }
    })
  }
}
