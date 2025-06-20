import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const currentRole = this.authService.getUserRoleName();

    console.log('Expected Role:', expectedRole);
    console.log('Current Role:', currentRole);

    if (!this.authService.isAuthenticated() || currentRole !== expectedRole) {
      console.log('Redirecting to /unauthorized');
      this.router.navigate(['/unauthorized']);
      return false;
    }

    return true;
  }
}