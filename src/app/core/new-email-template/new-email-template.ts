import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent } from 'ngx-editor';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-new-email-template',
  imports: [NgxEditorComponent, NgxEditorMenuComponent, FormsModule, RouterModule, CommonModule],
  templateUrl: './new-email-template.html',
  styleUrl: './new-email-template.css',
})
export class NewEmailTemplate implements OnInit, OnDestroy {
  actionPermission: ReadWritePermission = {
    readPermission: false,
    writePermission: false
  }
  cookieUserData: any = {};
  constructor(
    private _cookieService: CookieStorageService,
  ) {
    this._cookieService.checkModuleAccess('Email Configuration');
  }
  html = '';
  editor!: Editor;
  ngOnInit(): void {
    this.editor = new Editor();
    this.getModulePermissions();
  }

  getModulePermissions() {
    this.cookieUserData = this._cookieService.getUser();
    this.actionPermission = this._cookieService.getRolePermission(this.cookieUserData?.roleId)
  }
  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
