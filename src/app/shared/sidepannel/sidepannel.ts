import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-sidepannel',
  imports: [RouterLink, Footer],
  templateUrl: './sidepannel.html',
  styleUrl: './sidepannel.css',
})
export class Sidepannel {}
