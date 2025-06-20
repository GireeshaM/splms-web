import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../../services/urls.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  fullName: string = '';
  photoUrl: string = 'assets/images/default-user.png'; // set default local image
  profileRoute: string = '/';
  showUserDropdown = false;
  showNavbar = false;
  role: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private urlsService: UrlsService
  ) {}

  ngOnInit(): void {
    this.showNavbar = this.authService.isAuthenticated();

    const user = this.authService.getLoggedInUser();
    const userId = this.authService.getUserId();
    this.role = this.authService.getUserRoleName();
    const roleId = this.authService.getUserRoleId();

    if (user) {
      this.fullName = user.fullName;
    }

    // Default photo from JWT or generic fallback
    this.photoUrl = this.getFallbackPhoto(user);

    if (userId !== null) {
      this.urlsService.getProfileByUserId(userId).subscribe({
        next: (profile) => {
          if (profile && profile.photoPath?.trim()) {
            this.photoUrl = profile.photoPath;
          } else {
            this.photoUrl = this.getFallbackPhoto(user);
          }
        },
        error: () => {
          this.photoUrl = this.getFallbackPhoto(user);
        },
      });
    }

    if (this.role) {
      this.setProfileRouteByRole(this.role);
    }

    // Construct profile route based on role and roleId
    if (this.role && roleId !== null) {
      this.profileRoute = `/profile/${this.role}/${roleId}`;
    }
  }

  // Helper to get photo from JWT or generic fallback
  private getFallbackPhoto(user: any): string {
    if (user?.photoPath?.startsWith('data:image')) {
      return user.photoPath;
    }
    return 'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg';
  }

  toggleUserDropdown(): void {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToDashboard(): void {
    switch (this.role) {
      case 'admin':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'instructor':
        this.router.navigate(['/instructor-dashboard']);
        break;
      case 'user':
        this.router.navigate(['/user-dashboard']);
        break;
      default:
        this.router.navigate(['/unauthorized']);
    }
  }

  setProfileRouteByRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'instructor':
        this.profileRoute = '/instructor-profile';
        break;
      case 'user':
        this.profileRoute = '/user-profile';
        break;
      default:
        this.profileRoute = '/admin-profile';
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }
}