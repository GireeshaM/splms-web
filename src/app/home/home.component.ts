import { Component } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { TopTrendsComponent } from '../top-trends/top-trends.component';
import { ModrenComponent } from '../modren/modren.component';
import { HomereviewsComponent } from '../homereviews/homereviews.component';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselComponent,TopTrendsComponent,HomereviewsComponent,RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
