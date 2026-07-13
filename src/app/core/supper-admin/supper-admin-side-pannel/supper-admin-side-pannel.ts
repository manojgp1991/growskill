import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { InitialsPipe } from '../../../services/pipe/initials-pipe';
import { AddNewSubscriptions } from '../add-new-subscriptions/add-new-subscriptions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-supper-admin-side-pannel',
  imports: [RouterLink,InitialsPipe],
  templateUrl: './supper-admin-side-pannel.html',
  styleUrl: './supper-admin-side-pannel.css',
})
export class SupperAdminSidePannel implements OnInit {
  localLogourl: string = '/assets/images/gs-logo.png';
  cookieUserData: any = {};
  constructor(
     private _cookieService: CookieStorageService,
        private modalService: NgbModal,
        private router: Router
  ) {
    this.cookieUserData = this._cookieService.getUser();
   }
  ngOnInit(): void {
    
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
           // this.getUsersByRole(); 
          }
        })
      }

        logOut() {
    this._cookieService.clearAllCookies();
    this.router.navigate(['/supper-admin-login']);
  }
}
