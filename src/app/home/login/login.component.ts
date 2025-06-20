import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ add this
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showLoginModal: boolean = true; // Controls modal visibility
  showRegisterModal: boolean = false;

  email: string = '';
  password: string = '';
  errorMessage: string = '';
  showPassword = false; // Add this line

  // Forgot password flow
  showForgotForm: boolean = false;
  showCodeForm: boolean = false;
  showResetForm: boolean = false;

  forgotEmail: string = '';
  verifyCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  private baseUrl = 'https://localhost:7215/api';

  constructor(
    private authService: AuthService, // Inject AuthService
    private router: Router,
    private toastr: ToastrService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['showRegister']) {
        this.showRegisterModal = true;
      }
    });
  }

  login(): void {
    const payload = { email: this.email, password: this.password };

    this.authService.login(payload).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token); // Save token to localStorage
        const token = res.token;
        const decodedToken = this.decodeJwtToken(token);
        const roleName =
          decodedToken[
            'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
          ];

        console.log('Decoded roleName:', roleName);

        this.toastr.success('Login successful');
        
        // Navigate based on user role
        let targetRoute = '/';
       switch (roleName) {
  case 'admin':
    targetRoute = '/admin-dashboard';
    break;
  case 'user':
    targetRoute = '/user-dashboard';
    break;
  case 'hr':
    targetRoute = '/hr-dashboard';
    break;
  case 'instructor':
    targetRoute = '/instructor-dashboard';
    break;
  default:
    targetRoute = '/unauthorized';
    break;
}
    this.router.navigate([targetRoute]).then(() => {
  window.location.reload(); // ✅ Force full reload so app knows user is logged in
});
        this.showLoginModal = false;
      },

      error: () => {
        this.errorMessage = 'Invalid email or password.';
        this.toastr.error(this.errorMessage);
      },
    });
  }

  decodeJwtToken(token: string): any {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }
  // Role-based redirection after login
  // Role-based redirection after login
  private navigateBasedOnRole(roleName: string): void {
    console.log('Navigating based on role:', roleName); // Debug role-based navigation

    switch (roleName) {
      case 'admin':
        console.log('Redirecting to admin-dashboard');
        this.router.navigate(['/admin-dashboard']).then((navigation) => {
          console.log('Navigation result (admin):', navigation); // Log navigation result
        });
        break;
      case 'user':
        console.log('Redirecting to user-dashboard');
        this.router.navigate(['/user-dashboard']).then((navigation) => {
          console.log('Navigation result (user):', navigation); // Log navigation result
        });
        break;
      case 'hr':
        console.log('Redirecting to hr-dashboard');
        this.router.navigate(['/hr-dashboard']).then((navigation) => {
          console.log('Navigation result (hr):', navigation); // Log navigation result
        });
        break;
      case 'instructor':
        console.log('Redirecting to instructor-dashboard');
        this.router.navigate(['/instructor-dashboard']).then((navigation) => {
          console.log('Navigation result (instructor):', navigation); // Log navigation result
        });
        break;
      default:
        console.log('Redirecting to unauthorized page');
        this.router.navigate(['/unauthorized']).then((navigation) => {
          console.log('Navigation result (unauthorized):', navigation); // Log navigation result
        });
        break;
    }
  }

  // Open forgot password form
  openForgotPasswordForm(): void {
    this.showForgotForm = true;
    this.showCodeForm = false;
    this.showResetForm = false;
  }

  // Send reset code to the provided email
  sendResetCode(): void {
    const payload = { email: this.forgotEmail };

    this.http
      .post(`${this.baseUrl}/Auth/forgot-password`, payload, {
        responseType: 'text' as 'json',
      })
      .subscribe({
        next: (res) => {
          this.toastr.success('Verification code sent to your email');
          this.showForgotForm = false;
          this.showCodeForm = true;
        },
        error: (err) => {
          console.error('Error sending reset code:', err); // Log error while sending reset code
          this.toastr.error('Failed to send verification code.');
        },
      });
  }

  // Verify the reset code entered by the user
  verifyResetCode(): void {
    const payload = {
      email: this.forgotEmail,
      code: this.verifyCode,
    };

    this.http.post<any>(`${this.baseUrl}/Auth/verify-code`, payload).subscribe({
      next: (res) => {
        this.toastr.success('Code verified. You can now reset your password.');
        this.showCodeForm = false;
        this.showResetForm = true;
      },
      error: (err) => {
        console.error('Error verifying reset code:', err); // Log error while verifying code
        this.toastr.error(err.error || 'Invalid or expired code.');
      },
    });
  }

  // Reset the user's password
  resetPassword(): void {
    if (this.newPassword !== this.confirmPassword) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    const payload = {
      email: this.forgotEmail,
      newPassword: this.newPassword,
      confirmPassword: this.confirmPassword,
    };

    this.http
      .post<any>(`${this.baseUrl}/Auth/reset-password`, payload)
      .subscribe({
        next: (response) => {
          this.toastr.success(response.message || 'Password reset successful');
          this.cancelForgotFlow();
        },
        error: (err) => {
          console.error('Error resetting password:', err); // Log error during password reset
          this.toastr.error(err.error?.message || 'Reset failed');
        },
      });
  }

  // Cancel the forgot password flow and reset all variables
  cancelForgotFlow(): void {
    this.showForgotForm = false;
    this.showCodeForm = false;
    this.showResetForm = false;
    this.forgotEmail = '';
    this.verifyCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.showLoginModal = false;
  }

  navigateToRegister(): void {
    this.router.navigate(['/home'], { queryParams: { showRegister: false } });
    this.showLoginModal = false;
  }
}