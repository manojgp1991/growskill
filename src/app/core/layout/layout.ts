import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidepannel } from '../../shared/sidepannel/sidepannel';

@Component({
  selector: 'app-layout',
  imports: [ Header, Sidepannel , RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {}
