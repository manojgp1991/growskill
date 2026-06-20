import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

  public isLoading = new BehaviorSubject(false);
  public loadingText = new BehaviorSubject('');
  constructor() { }
}
