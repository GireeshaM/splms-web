import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollToTopComponent } from './Basic/scroll-to-top/scroll-to-top.component';
import { NavbarComponent } from './navbars/navbar/navbar.component';
import { FooterComponent } from './footer-section/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScrollToTopComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'slmsApp';
}
