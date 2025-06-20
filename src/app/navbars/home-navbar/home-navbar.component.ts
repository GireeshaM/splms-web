import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../../home/register/register.component';
import { LoginComponent } from '../../home/login/login.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { UrlsService } from '../../services/urls.service';

@Component({
  selector: 'app-home-navbar',
  imports: [CommonModule, LoginComponent, RegisterComponent, RouterLink],
  templateUrl: './home-navbar.component.html',
  styleUrl: './home-navbar.component.css'
})
export class HomeNavbarComponent implements OnInit {
  showLoginModal = false;
  showRegisterModal = false;
  isLoggedIn = false;
  fullName = '';
  photoUrl = 'assets/images/default-user.png'; // default
  role: string | null = null;
  profileRoute = '/';
    dashboardRoute = '/'; // Add this line


  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    public authService: AuthService,
    private urlsService: UrlsService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    const user = this.authService.getLoggedInUser();
    const userId = this.authService.getUserId();
    this.role = this.authService.getUserRoleName();
    const roleId = this.authService.getUserRoleId();

    if (user) {
      this.fullName = user.fullName;
      this.photoUrl = this.getFallbackPhoto(user);
      
    }
    console.log(this.fullName);

    if (userId) {
      this.urlsService.getProfileByUserId(userId).subscribe({
        next: (profile) => {
          if (profile?.photoPath?.trim()) {
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
            this.setDashboardRouteByRole(this.role); // 👈 Set dashboard route

    }

    if (this.role && roleId !== null) {
      this.profileRoute = `/profile/${this.role}/${roleId}`;
    }

    this.route.queryParams.subscribe((params) => {
      this.showLoginModal = !!params['showLogin'];
      this.showRegisterModal = !!params['showRegister'];

      if (this.showRegisterModal) {
        this.openRegisterModal();
      }
      if (this.showLoginModal) {
        this.openLoginModal();
      }
    });
  }


  // ✅ Add this function
  setDashboardRouteByRole(role: string): void {
    switch (role.toLowerCase()) {
      case 'admin':
        this.dashboardRoute = '/admin-dashboard';
        break;
      case 'user':
        this.dashboardRoute = '/user-dashboard';
        break;
      case 'hr':
        this.dashboardRoute = '/hr-dashboard';
        break;
      case 'instructor':
        this.dashboardRoute = '/instructor-dashboard';
        break;
      default:
        this.dashboardRoute = '/unauthorized';
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
      case 'admin':
        this.profileRoute = '/admin-profile';
        break;
      default:
        this.profileRoute = '/profile';
    }
  }

  private getFallbackPhoto(user: any): string {
    if (user?.photoPath?.startsWith('data:image')) {
      return user.photoPath;
    }
    return 'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg';
  }

  openLoginModal() {
    const dialogRef = this.dialog.open(LoginComponent, {
      width: '400px',
      disableClose: false,
      backdropClass: 'custom-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {
        queryParams: { showLogin: null },
        queryParamsHandling: 'merge',
      });
    });
  }

  openRegisterModal() {
    const dialogRef = this.dialog.open(RegisterComponent, {
      width: '400px',
      disableClose: false,
      backdropClass: 'custom-backdrop',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([], {
        queryParams: { showRegister: null },
        queryParamsHandling: 'merge',
      });
    });
  }

  logout(): void {
  this.authService.logout();
  this.isLoggedIn = false;
  this.router.navigate(['/']);
}


  closeLoginModal() {
    document.getElementById('loginModal')!.style.display = 'none';
  }
}
