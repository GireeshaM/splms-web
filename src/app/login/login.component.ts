import { Component } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/authentication/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-login',
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  showResetPasswordForm= false;

  resetPasswordForm=this.fb.group({
    newPassword:['',Validators.required,Validators.minLength(6)],
    confirmPassword:['',Validators.required,Validators.minLength(6)]
  })

  loginForm= this.fb.group({
    email:['',Validators.required,Validators.email],
    password:['',Validators.required]
  })

  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], // Email validation for forgot password
    otp: ['', Validators.required] // OTP field for verification
  });
 
  isForgotPasswordMode = false; // Toggle between login and forgot password modes
  showOtpInput = false; // Toggle OTP input visibility
 
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}
 

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
  
    const credentials = this.loginForm.value;
  
    this.authService.login(credentials).subscribe({
      next: () => {
        const role = this.authService.getRoleFromToken();
  
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'instructor') {
          this.router.navigate(['/instructor/dashboard']);
        } else if (role === 'user') {
          this.router.navigate(['core/user/dashboard']);
        } else {
          // fallback route if role is missing or unknown
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
        // Optionally show error message to user
      }
    });
  }
  // Toggle between login and forgot password forms
  toggleForgotPassword(): void {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.showOtpInput = false; // Reset OTP input visibility
    this.showResetPasswordForm = false; // Reset reset password form visibility
  }
 
  // Handle forgot password form submission (Send OTP)
  onSendOtp(): void {
    const email = this.forgotPasswordForm.get('email')?.value || ''; // Ensure email is a string
 
    if (!email) {
      alert('Please enter a valid email.');
      return;
    }
 
    console.log('Sending OTP to email:', email); // Debugging log
 
    this.authService.sendOtp(email).subscribe({
      next: (response) => {
        if (typeof response === 'string') {
          alert(response); // Display the plain text response
        } else {
          alert('OTP sent to your email.');
        }
        this.showOtpInput = true; // Show the OTP input field
      },
      error: (err) => {
        console.error('Failed to send OTP:', err); // Log the error for debugging
        alert(err.error?.message || 'Failed to send OTP. Please try again.');
      }
    });
  }
 
  // Handle OTP verification
  onVerifyOtp(): void {
    const otp = this.forgotPasswordForm.get('otp')?.value || ''; // Ensure otp is a string
    const email = this.forgotPasswordForm.get('email')?.value || ''; // Retrieve the email from the form
 
    if (!otp) {
      alert('Please enter the OTP.');
      return;
    }
 
    if (!email) {
      alert('Email is missing. Please try again.');
      return;
    }
 
    const payload = { Code: otp, Email: email }; // Match the backend's expected keys
    console.log('Verifying OTP with payload:', payload); // Debugging log
 
    this.authService.verifyOtp(payload).subscribe({
      next: () => {
        alert('OTP verified successfully.');
        this.showOtpInput = false; // Hide OTP input
        this.showResetPasswordForm = true; // Show reset password form
      },
      error: (err) => {
        console.error('Failed to verify OTP:', err); // Log the error for debugging
        alert(err.error?.message || 'Failed to verify OTP. Please try again.');
      }
    });
  }
 
  // Handle reset password form submission
  onResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }
 
    const email = this.forgotPasswordForm.get('email')?.value || ''; // Retrieve the email from the forgot password form
    const newPassword = this.resetPasswordForm.get('newPassword')?.value || ''; // Ensure newPassword is a string
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value || ''; // Ensure confirmPassword is a string
 
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
 
    const payload = { email, newPassword, confirmPassword };
    console.log('Resetting password with payload:', payload); // Debugging log
 
    this.authService.resetPassword(payload).subscribe({
      next: () => {
        alert('Password reset successfully.');
        this.showResetPasswordForm = false; // Hide reset password form
        this.isForgotPasswordMode = false; // Redirect back to login form
      },
      error: (err) => {
        console.error('Failed to reset password:', err); // Log the error for debugging
        alert(err.error?.message || 'Failed to reset password. Please try again.');
      }
    });
  }
}