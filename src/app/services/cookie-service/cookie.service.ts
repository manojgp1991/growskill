import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ReadWritePermission } from '../../models/loginUser/menuPermission';

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {
  constructor(private _cookieService: CookieService) {

  }

  setToken(token: any, callback: any) {
    this._cookieService.set("token", token)
    if (callback) { callback() }
  }
  getToken(): string {
    return this._cookieService.get("token");
  }
  getUser() {
    let user: any = this._cookieService.get("growskill_user");
    if (user) {
      return JSON.parse(user);
    } else {
      return null;
    }
  }
  setUser(UserData: any) {
    this._cookieService.set("growskill_user", JSON.stringify(UserData));
  }
  clearAllCookies() {
    this._cookieService.deleteAll();
    localStorage.clear();
  }

  setLocalStorage(key: string, value: any) {
    localStorage.setItem(key, value);
  }
  getLocalStorage(key: string): any {
    return localStorage.getItem(key);
  }

  hasModuleAccess(moduleName: string): boolean {
  const user = this.getUser();
  if (!user || !user.moduleAccess) {
    return false;
  }
  const module = user.moduleAccess.find(
    (m: any) => m.module_name.toLowerCase() === moduleName.toLowerCase()
  );
  return module?.allow_access ?? false;
}

getRolePermission(roleId: number): ReadWritePermission {
  const user = this.getUser();

  if (!user || !user.permissions) {
    return { readPermission: false, writePermission: false };
  }

  const permission = user.permissions.find(
    (p: any) => p.role_id === roleId
  );

  return permission
    ? {
        readPermission: permission.allow_read,
        writePermission: permission.allow_write
      }
    : {
        readPermission: false,
        writePermission: false
      };
}

}
