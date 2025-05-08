import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../services/authentication/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {trigger,state, style,animate,transition} from '@angular/animations';
import { ConfirmEqualValidatorDirective } from './confirm-equal-validator.directive';

// import { PasswordMatchValidator } from '../services/interests.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule,ConfirmEqualValidatorDirective ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})

export class RegisterComponent implements OnInit {
  isRegisterMode = false;
  
  photoBase64: string = '';
  
  toggleRegister(): void {
  console.log("Sign Up clicked");
  this.isRegisterMode = true;
}
toggleLogin(): void {
  this.isRegisterMode = false;
}
allowOnlyNumbers(event: KeyboardEvent) {
  const charCode = event.which ? event.which : event.keyCode;
  // Allow digits (48–57), backspace (8), delete (46), + (43), dash (45)
  if (
    (charCode >= 48 && charCode <= 57) || // digits 0–9
    charCode === 8 || // backspace
    charCode === 46 || // delete
    charCode === 43 || // +
    charCode === 45 // -
  ) {
    return;
  } else {
    event.preventDefault();
  }
}

   roles: any[] = [];
  // categories: any[] = [];
  // subCategories: any[] = [];
  isSubmitting = false;
  subCategoriesList: { [key: number]: any[] } = {};
  // step: number = 1;
  // displayInterests: string[] = [];
 registerForm: FormGroup = this.fb.group(
  {
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [
      Validators.required,
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
    ]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    roleId: ['', Validators.required],
    // interests: this.fb.array([]),
    bio:[''],
    linkedIn:[''],
    birthDay:[''],
    websiteLink:[''],
    designation:[''],
    highestDegree:[''],
  },
);
  // Login-related fields
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  // Forgot password fields
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    otp: ['', Validators.required],
  });
  // Reset password form
  resetPasswordForm = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });
  isForgotPasswordMode = false;
  showOtpInput = false;
  showResetPasswordForm = false;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    @Inject(Router) private router: Router
  ) {}
  ngOnInit(): void {
    this.auth.getRoles().then((roles: any[]) => {
      this.roles = roles;
    }).catch((err: any) => {
      console.error('Failed to fetch roles:', err);
    });
    
    // this.auth.getCategories().then((categories: any[]) => {
    //   this.categories = categories;
    // }).catch((err: any) => {
    //   console.error('Failed to fetch categories:', err);
    // });
   
  }
  // get interests(): FormArray {
  //   return this.registerForm.get('interests') as FormArray;
  // }
  get registerFormStep1(): FormGroup {
    const step1Form = this.fb.group({
      fullName: this.registerForm.get('fullName'),
      email: this.registerForm.get('email'),
      phoneNumber: this.registerForm.get('phoneNumber'),
      password: this.registerForm.get('password'),
      confirmPassword: this.registerForm.get('confirmPassword'),
      roleId: this.registerForm.get('roleId'),
      bio: [''],
      linkedIn: [''],
      birthDay: [''],
      websiteLink: [''],
      designation: [''],
      highestDegree: [''],
    }) as FormGroup;
  
    console.log('Form Errors:', this.registerForm.errors);
    console.log('Form Values:', this.registerForm.value);
    return step1Form;
  }
  
  
  onPhotoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.photoBase64 = reader.result as string; // Store the base64 string
      };
      reader.readAsDataURL(file); // Trigger the file read
    }
  }

  // Login method
  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    const credentials = this.loginForm.value;
    this.auth.login(credentials).subscribe({
      next: () => {
        const role = this.auth.getRoleFromToken();
        if (role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'instructor') {
          this.router.navigate(['/instructor/dashboard']);
        } else if (role === 'user') {
          this.router.navigate(['/user/dashboard']);
        } else {
          this.router.navigate(['/register']);
        }
      },
      error: (err) => {
        console.error('Login failed:', err);
      }
    });
  }
  // Forgot password toggle
  toggleForgotPassword(): void {
    this.isForgotPasswordMode = !this.isForgotPasswordMode;
    this.showOtpInput = false;
    this.showResetPasswordForm = false;
  }
  // Send OTP for forgotten password
  onSendOtp(): void {
    const email = this.forgotPasswordForm.get('email')?.value || '';
    if (!email) {
      alert('Please enter a valid email.');
      return;
    }

    this.auth.sendOtp(email).subscribe({
      next: (response) => {
        alert('OTP sent to your email.');
        this.showOtpInput = true;
      },
      error: (err) => {
        console.error('Failed to send OTP:', err);
        alert('Failed to send OTP. Please try again.');
      }
    });
  }
  // Verify OTP for forgotten password
  onVerifyOtp(): void {
    const otp = this.forgotPasswordForm.get('otp')?.value || '';
    const email = this.forgotPasswordForm.get('email')?.value || '';

    if (!otp || !email) {
      alert('Please fill in the OTP and email.');
      return;
    }

    const payload = { Code: otp, Email: email };
    this.auth.verifyOtp(payload).subscribe({
      next: () => {
        alert('OTP verified successfully.');
        this.showOtpInput = false;
        this.showResetPasswordForm = true;
      },
      error: (err) => {
        console.error('Failed to verify OTP:', err);
        alert('Failed to verify OTP. Please try again.');
      }
    });
  }
  // Reset password
  onResetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      alert('Please fill out all required fields correctly.');
      return;
    }

    const email = this.forgotPasswordForm.get('email')?.value || '';
    const newPassword = this.resetPasswordForm.get('newPassword')?.value || '';
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value || '';

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const payload = { email, newPassword, confirmPassword };
    this.auth.resetPassword(payload).subscribe({
      next: () => {
        alert('Password reset successfully.');
        this.showResetPasswordForm = false;
        this.isForgotPasswordMode = false;
      },
      error: (err) => {
        console.error('Failed to reset password:', err);
        alert('Failed to reset password. Please try again.');
      }
    });
  }

  // Register method
onRegisterSubmit(): void {
    console.log('Register form submitted');
    
    // Check if the form is valid
    if (this.registerForm.invalid) {
      console.log('Form is invalid:', this.registerForm.errors);
      alert('Please fill out all required fields correctly.');
      return;
    }
  
    // Check if there are no selected interests
    // if (this.selectedInterests.length === 0) {
    //   console.log('No interests selected');
    //   alert('Please add at least one interest before registering.');
    //   return;
    // }
  
    // Check if photo is uploaded (if required by the backend)
    if (!this.photoBase64) {
      console.log('Photo not uploaded');
      alert('Please upload a photo.');
      return;
    }
  
    // Prepare the registration data
    const formValue = this.registerForm.value;
  
    const registerData = {
      fullName: formValue.fullName,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      password: formValue.password,
      confirmPassword: formValue.confirmPassword,
      roleId: +formValue.roleId, // Ensure roleId is a number
      photoPath: this.photoBase64, // Ensure this is a valid base64 string
      // interests: this.selectedInterests.map((item: any) => ({
      //   categoryId: +item.categoryId, // Ensure categoryId is a number
      //   subCategoryId: +item.subCategoryId // Ensure subCategoryId is a number
      // }))
    };
    console.log(this.registerForm.value);
    console.log('Register Data:', registerData);
  
    this.isSubmitting = true;
  
    // Call the register API
    this.auth.register(registerData).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
        this.isSubmitting = false;
        alert('Details submitted successfully!');
        this.router.navigate(['/register']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error('Registration failed:', err);
        alert(err.error?.message || 'An error occurred during registration.');
      }
    });
    
  }

onClose(): void {
  this.router.navigate(['/']); // Example: Redirecting to home page
}

}