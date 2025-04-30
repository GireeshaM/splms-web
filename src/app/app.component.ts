import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {
  title = 'splms-web';
  isHomePage: boolean = false;
  isRegister: boolean = false;
  isLogin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isHomePage = url === '';
        this.isRegister = url === '/register';
        this.isLogin = url === '/login';
      }
    });
  }
}
