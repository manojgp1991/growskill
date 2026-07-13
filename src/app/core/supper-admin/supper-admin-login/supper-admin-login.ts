import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CookieStorageService } from '../../../services/cookie-service/cookie.service';
import { ApplicationToasterService } from '../../../services/toaster-service/toaster-service';
import { GrowSkillAPIEndPointPath } from '../../../services/api-service/api.service.path';
import { ApiService } from '../../../services/api-service/api.service';
import { ThemeCssService } from '../../../services/theme-service/theme-service';

@Component({
  selector: 'app-supper-admin-login',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './supper-admin-login.html',
  styleUrl: './supper-admin-login.css',
})
export class SupperAdminLogin implements OnInit {
   localLogourl: string = '/assets/images/gs-logo.png';
   showPassword = false;
  isSubmitting = false;
  errorMessage = '';
  loginForm!: FormGroup;
  selectedRole: number | 1 = 1;
  
  constructor(
    private _router: Router,
    private cdr: ChangeDetectorRef,
    private _toaster: ApplicationToasterService,
    private _cookieService: CookieStorageService,
    private fb: FormBuilder,
    private _apiService: ApiService,
    private themeService: ThemeCssService
  ) {
    
  }
  ngOnInit(): void {
     this.loginForm = this.fb.group({
      user_name: ['', [Validators.required, Validators.email]],
      user_password: ['', [Validators.required]]
    });
  }
  doLogin() {
    this._router.navigate(['supper-admin-login'])
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
        user_name: this.loginForm.value.user_name,
        user_password: this.loginForm.value.user_password,
        user_role: this.selectedRole
      };
  
      this._apiService.Post$(GrowSkillAPIEndPointPath.SupperAdminLogin, payload, true).subscribe({
        next: (res: any) => {
          if (res.status) {
  
              if (res?.accessToken) {
              this._cookieService.setToken(res?.accessToken , () => {});
            }
  
            if (res?.response?.length > 0) {
              this._cookieService.setUser(res?.response[0]);
            }
              this.themeService.loadTheme('supper-admin');
            this._toaster.success('Login Successful', 'You are logged in successfully.');
            this._router.navigateByUrl('/admin-dashboard');
  
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
    
}
