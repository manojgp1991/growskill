import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api-service/api.service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { Subscription } from 'rxjs';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { InitialsPipe } from '../../services/pipe/initials-pipe';
import { CommonModule } from '@angular/common';
import { MenuPermission, ReadWritePermission } from '../../models/loginUser/menuPermission';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

export interface DashboardChartModel {
  id: number;
  caption: string;
  color_code: string;
  sort_order: number;
  count: number;
}

@Component({
  selector: 'app-admin-home',
  imports: [InitialsPipe, CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './admin-home.html',
  styleUrl: './admin-home.css',
})
export class AdminHome implements OnInit {
  homeDataSubscription: Subscription | undefined;
  cookieUserData: any = {};
  totalSummary: any = {};
  pipelineBreakdownList: any[] = [];
  recentContacts: any[] = [];
  avatarGradients: string[] = [
    'linear-gradient(135deg,#00C8A0,#0099CC)',
    'linear-gradient(135deg,#F59E0B,#D97706)',
    'linear-gradient(135deg,#3B82F6,#1D4ED8)',
    'linear-gradient(135deg,#EC4899,#BE185D)'
  ];
  statCardClasses = ['purple', 'orange', 'green', 'blue'];
  statIcons = [
    'ri-user-add-line',
    'ri-checkbox-circle-line',
    'ri-trophy-line',
    'ri-user-star-line'
  ];
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }
  menuPermissions: MenuPermission = {
    dashboard: false,
    contacts: false,
    pipeline: false,
    bulkImport: false,
    userManagement: false,
    settings: false,
    emailConfiguration: false,
    companyProfileConfiguration: false,
    pipelineConfiguration: false,
    myProfile: false,
    subscription: false
  }
  dashboardChatStatusList: DashboardChartModel[] = [];

  barChartData!: ChartConfiguration<'bar'>['data'];
  pieChartData!: ChartConfiguration<'pie'>['data'];
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: { legend: { display: true } }
  };
  pieChartOptions: ChartConfiguration<'pie'>['options'] = {
    responsive: true
  };

  constructor(
    private _apiService: ApiService,
    private _cookieService: CookieStorageService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal,
    private _toaster: ApplicationToasterService,
    private _router: Router
  ) {
    this.cookieUserData = this._cookieService.getUser();
    this._cookieService.checkModuleAccess('Dashboard');
    this.getModulePermissions();
    this.getActionModulePermissions();
  }
  ngOnInit(): void {
    this.cdr.markForCheck();
    this.loadHomePageData(true);
  }
  loadHomePageData(isPageLoaderShow: boolean) {
    const payload = {
      user_id: this.cookieUserData?.id,
      sub_id: this.cookieUserData?.subcriptionId
    };
    if (this.homeDataSubscription) {
      this.homeDataSubscription.unsubscribe();
    }
    this.homeDataSubscription =
      this._apiService.Post$(GrowSkillAPIEndPointPath.GetDashboardData, payload, isPageLoaderShow).subscribe({
        next: (res: any) => {
          if (res.status) {
            if (res?.response) {
              const result = res?.response ?? {};
              this.recentContacts = result?.dashboard5DaysContactList ?? [];
              this.pipelineBreakdownList = result?.statusWiseContacts ?? [];
              this.totalSummary = result?.totalContacts ?? {};
              this.dashboardChatStatusList = res.response?.dashboardChartStatusList ?? [];
              this.buildCharts();
              console.log(res.response);
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
  openContactDetail($event: any) {
    var clickedContact: any = $event;
    let pdata = {
      internal_code: clickedContact.internal_code
    }
    let navigationExtras: NavigationExtras = {
      queryParams: {
        "pdata": JSON.stringify(pdata)
      }
    };
    this._router.navigate(['contacts-details'], navigationExtras);
  }
  getAvatarStyle(index: number) {
    this.cdr.markForCheck();
    return {
      width: '38px',
      height: '38px',
      fontSize: '.78rem',
      background: this.avatarGradients[index % this.avatarGradients.length]
    };

  }

  trackByPipeline(index: number, status: any): string {
    return status?.totalContactText ?? index;
  }
  trackByContact(index: number, status: any): string {
    return status?.internal_code ?? index;
  }
  getModulePermissions() {
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
  getActionModulePermissions() {
    this.menuPermissions = {
      dashboard: this._cookieService.hasModuleAccess('Dashboard'),
      contacts: this._cookieService.hasModuleAccess('Contacts'),
      pipeline: this._cookieService.hasModuleAccess('Pipeline'),
      bulkImport: this._cookieService.hasModuleAccess('Bulk Import'),
      userManagement: this._cookieService.hasModuleAccess('User Management'),
      settings: this._cookieService.hasModuleAccess('Settings'),
      emailConfiguration: this._cookieService.hasModuleAccess('Email Configuration'),
      companyProfileConfiguration: this._cookieService.hasModuleAccess('Company Profile Configuration'),
      pipelineConfiguration: this._cookieService.hasModuleAccess('Pipeline Configuration'),
      myProfile: this._cookieService.hasModuleAccess('My Profile'),
      subscription: this._cookieService.hasModuleAccess('Subscription')
    };
  }

  buildCharts(): void {
    this.barChartData = {
      labels: this.dashboardChatStatusList.map(s => s.caption),
      datasets: [{
        data: this.dashboardChatStatusList.map(s => s.count),
        backgroundColor: this.dashboardChatStatusList.map(s => s.color_code),
        borderRadius: 6,
        label: 'Chart Data'
      }]
    };

    this.pieChartData = {
      labels: this.dashboardChatStatusList.map(s => s.caption),
      datasets: [{
        data: this.dashboardChatStatusList.map(s => s.count),
        backgroundColor: this.dashboardChatStatusList.map(s => s.color_code)
      }]
    };

    this.cdr.markForCheck();
  }
}
