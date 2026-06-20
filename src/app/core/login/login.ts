import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api-service/api.service';
import { Router } from '@angular/router';
import { GrowSkillAPIEndPointPath } from '../../services/api-service/api.service.path';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApplicationToasterService } from '../../services/toaster-service/toaster-service';
import { CookieStorageService } from '../../services/cookie-service/cookie.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  userLogSubscription: Subscription | undefined;
  userRoles: any[] = [];
  selectedRole: string | null = null;
  isSubmitting = false;
  errorMessage = '';
  loginForm!: FormGroup;

  constructor(
    private _apiService: ApiService,
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private _toaster: ApplicationToasterService,
    private _cookieService: CookieStorageService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]]
    });

    this.getCategoriesList(false);
  }
  getCategoriesList(isPageLoaderShow: boolean) {
    this.getCategoriesAPICall(isPageLoaderShow);
  }
  getCategoriesAPICall(isPageLoaderShow: boolean) {
    if (this.userLogSubscription) {
      this.userLogSubscription.unsubscribe();
    }
    this.userLogSubscription = this._apiService
      .Get$(GrowSkillAPIEndPointPath.UserRoles, isPageLoaderShow)
      .subscribe(
        (res) => {
          let result: any = res;
          if (result.status) {
            this.userRoles = result?.response ?? [];
            if (this.userRoles.length > 0) {
              this.selectedRole = this.userRoles[0]?.role ?? null;
            }
            this.cdr.markForCheck();
          }
        },
        (err) => { }
      );
  }
  selectRole(role: any): void {
    this.selectedRole = role?.id ?? null;
    this.cdr.markForCheck();
  }

  onSubmit(event?: Event): void {
    event?.preventDefault();

    if (this.loginForm.invalid || !this.selectedRole) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Please select a role and enter valid credentials.';
      this._toaster.error('', this.errorMessage);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload = {
      sub_id: '1E44A0B1-4D30-4ED7-B659-18548A53823D',
      user_name: this.loginForm.value.user_name,
      user_password: this.loginForm.value.user_password,
      user_role: this.selectedRole
    };

    this._apiService.Post$(GrowSkillAPIEndPointPath.Login, payload, true).subscribe({
      next: (res: any) => {
        if (res.status) {

            if (res?.accessToken) {
            this._cookieService.setToken(res?.accessToken , () => {});
          }

          if (res?.response?.length > 0) {
            this._cookieService.setUser(res?.response[0]);
          }

          this._toaster.success('Login Successful', 'You are logged in successfully.');
          this._router.navigateByUrl('/');

        } else {
          this.errorMessage = res.message || 'Invalid email or password.';
          this._toaster.error('Login Failed', this.errorMessage);
        }

        this.isSubmitting = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Something went wrong. Please try again later.';
        this._toaster.error('Login Failed', this.errorMessage);
        this.cdr.markForCheck();
      }
    });
  }

  trackByRole(index: number, role: any): string {
    return role?.role ?? index;
  }
}
