import { Component, Input, OnInit } from '@angular/core';
import { PageLoaderService } from '../../services/page.loader.service/page.loader.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  imports: [CommonModule],
  templateUrl: './loader.html',
  styleUrl: './loader.css',
})
export class Loader implements OnInit {


  IsShowPageLoader: boolean = false;
  Loadertext: string = "Loading while fetching data...";
  @Input() applyClass: string  | any;
  constructor(private loaderService: PageLoaderService) {debugger
    this.loaderService.isLoading.subscribe((result: boolean) => {
      this.IsShowPageLoader = result;
    });
    this.loaderService.loadingText.subscribe((result: string) => {
      this.Loadertext = result || 'Loading while fetching data...';
    })
  }
   ngOnInit(): void {
   
  }
  
}
