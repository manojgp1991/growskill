import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CommonModule } from '@angular/common';

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
  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.cookieUserData = this._cookieService.getUser();
    this.getUsersByRole()
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
}
