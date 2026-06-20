import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ApplicationToasterService {
  constructor(private toastr: ToastrService) {

  }
  success(heading: string = "", body: string) {
    this.toastr.success(heading, body);
  }
  error(heading: string = "", body: string) {
    this.toastr.error(heading, body);
  }
  warning(heading: string = "", body: string) {
    this.toastr.warning(heading, body);
  }
  information(heading: string = "", body: string) {
    this.toastr.info(heading, body);
  }
}
