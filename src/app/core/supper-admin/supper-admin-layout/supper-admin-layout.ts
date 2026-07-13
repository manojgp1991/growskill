import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupperAdminSidePannel } from '../supper-admin-side-pannel/supper-admin-side-pannel';
import { SupperAdminHeader } from '../supper-admin-header/supper-admin-header';

@Component({
  selector: 'app-supper-admin-layout',
  imports: [RouterOutlet, SupperAdminSidePannel, SupperAdminHeader],
  templateUrl: './supper-admin-layout.html',
  styleUrl: './supper-admin-layout.css',
})
export class SupperAdminLayout {}
