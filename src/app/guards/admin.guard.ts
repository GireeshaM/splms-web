import { Inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(@Inject(AuthService) private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    const role = this.auth.getRoleFromToken();
    if (role === 'admin') return true;
    this.router.navigate(['/login']);
    return false;
  }
}
