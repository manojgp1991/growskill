import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  Get$(url: string, loading: boolean = false): Observable<any> {
    let myheader = new HttpHeaders().set('IsShowPageLoader', loading ? "true" : "false");
    let finalUrl = environment.baseUrl + '/' + url;
    return this.http.get<any>(finalUrl, { headers: myheader })
      .pipe(map(response => {
        return response;
      }));
  }
  Post$(url: string, data: any, loading: boolean = false): Observable<any> {
    let myheader = new HttpHeaders().set('IsShowPageLoader', loading ? "true" : "false");
    let finalUrl = environment.baseUrl + '/' + url;
    return this.http.post<any>(finalUrl, data, { headers: myheader })
      .pipe(map(response => {
        return response;
      }));
  }
}
