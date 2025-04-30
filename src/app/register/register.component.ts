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
  selectedInterests: any[] = []; 
  editingIndex: number | null = null;
  editableCategoryId: number | null = null;
  editableSubCategoryId: number | null = null;
  toggleRegister(): void {
  console.log("Sign Up clicked");
  this.isRegisterMode = true;
}
toggleLogin(): void {
  this.isRegisterMode = false;
}
   roles: any[] = [];
  categories: any[] = [];
  subCategories: any[] = [];
  isSubmitting = false;
  subCategoriesList: { [key: number]: any[] } = {};
  step: number = 1;
  displayInterests: string[] = [];
 registerForm: FormGroup = this.fb.group(
  {
    fullName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
    roleId: ['', Validators.required],
    interests: this.fb.array([]),
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
    this.auth.getCategories().then((categories: any[]) => {
      this.categories = categories;
    }).catch((err: any) => {
      console.error('Failed to fetch categories:', err);
    });
   
  }
  get interests(): FormArray {
    return this.registerForm.get('interests') as FormArray;
  }
  get registerFormStep1(): FormGroup {
    return this.fb.group({
      fullName: this.registerForm.get('fullName'),
      email: this.registerForm.get('email'),
      phoneNumber: this.registerForm.get('phoneNumber'),
      password: this.registerForm.get('password'),
      confirmPassword: this.registerForm.get('confirmPassword'),
      roleId: this.registerForm.get('roleId'),
    }) as FormGroup;
    console.log('Form Errors:', this.registerForm.errors);
console.log('Form Values:', this.registerForm.value);
  }
  private createInterestFormGroup(): FormGroup {
    return this.fb.group({
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
    });
  }
  removeInterest(index: number): void {
    this.interests.removeAt(index);
    delete this.subCategoriesList[index];
    this.displayInterests.splice(index, 1);
  }
  onCategoryChange(event: Event, index: number): void {
    const categoryId = (event.target as HTMLSelectElement).value;
    if (!categoryId) {
      this.subCategoriesList[index] = [];
      this.displayInterests[index] = '';
      return;
    }
    this.auth.getSubCategoriesByCategoryId(Number(categoryId)).then((subCategories: any[]) => {
      this.subCategoriesList[index] = subCategories;
      const interestGroup = this.interests.at(index) as FormGroup;
      interestGroup.patchValue({ subCategoryId: '' });
      interestGroup.get('subCategoryId')?.valueChanges.subscribe((selectedId: string) => {
        const name = subCategories.find(sc => sc.subCategoriesId == selectedId)?.name;
        this.displayInterests[index] = name || '';
      });
    }).catch((err: any) => {
      console.error('Failed to fetch subcategories:', err);
    });
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
  goToStep(stepNumber: number): void {
    this.step = stepNumber;
  }
  goToStep2(): void {
    if (this.registerFormStep1.valid && this.interests.length > 0) {
      this.step = 2;
    } else {
      Object.keys(this.registerFormStep1.controls).forEach(field => {
        const control = this.registerForm.get(field);
        control?.markAsTouched({ onlySelf: true });
      });
  
      if (this.interests.length === 0) {
        alert('Please add at least one interest');
      }
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
          this.router.navigate(['/login']);
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
// Add this method in your RegisterComponent class
toggleForm(formType: number): void {
  // Logic to toggle the form view
  if (formType === 1) {  // Compare with numbers, not strings
    this.isForgotPasswordMode = false;
    this.showOtpInput = false;
    this.showResetPasswordForm = false;
    this.step = 1; // Ensure you're setting the correct step for registration
  } else if (formType === 2) {
    this.isForgotPasswordMode = true;
    this.showOtpInput = false;
    this.showResetPasswordForm = false;
  } else if (formType === 3) {  // You can assign a unique number for resetPassword
    this.isForgotPasswordMode = false;
    this.showOtpInput = false;
    this.showResetPasswordForm = true;
  }
}
editInterest(index: number): void {
  this.editingIndex = index;
  const interest = this.interests.at(index).value;

  // Load subcategories for the selected category
  if (interest.categoryId) {
    this.auth.getSubCategoriesByCategoryId(interest.categoryId).then((subCategories: any[]) => {
      this.subCategoriesList[index] = subCategories;
    });
  }
}
saveEditedInterest(index: number): void {
  const interestForm = this.interests.at(index).value;
  const category = this.categories.find(c => c.categoriesId == interestForm.categoryId);
  const subCategory = this.subCategoriesList[index]?.find(sc => sc.subCategoriesId == interestForm.subCategoryId);

  if (category && subCategory) {
    this.displayInterests[index] = `${category.name} - ${subCategory.name}`;
  }

  this.cancelEdit();
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
    if (this.selectedInterests.length === 0) {
      console.log('No interests selected');
      alert('Please add at least one interest before registering.');
      return;
    }
  
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
      interests: this.selectedInterests.map((item: any) => ({
        categoryId: +item.categoryId, // Ensure categoryId is a number
        subCategoryId: +item.subCategoryId // Ensure subCategoryId is a number
      }))
    };
  
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
addInterest(): void {
  // Add a new interest form group and set it as the editing index
  this.interests.push(this.createInterestFormGroup());
  this.editingIndex = this.interests.length - 1;
}
saveInterest(index: number): void {
  const interestForm = this.interests.at(index).value;
  const category = this.categories.find(c => c.categoriesId == interestForm.categoryId);
  const subCategory = this.subCategoriesList[index]?.find(sc => sc.subCategoriesId == interestForm.subCategoryId);

  if (category && subCategory) {
    // Add the selected interest to the "My Interests" section
    this.selectedInterests.push({
      categoryId: interestForm.categoryId,
      subCategoryId: interestForm.subCategoryId,
      categoryName: category.name,
      subCategoryName: subCategory.name,
    });
    // Remove the interest from the form array
    this.interests.removeAt(index);
    this.editingIndex = null; // Reset editing index
  }
}
cancelEdit(): void {
  // Remove the unsaved interest and reset the editing index
  if (this.editingIndex !== null) {
    this.interests.removeAt(this.editingIndex);
    this.editingIndex = null;
  }
}
removeSelectedInterest(index: number): void {
  // Remove the interest from the "My Interests" section
  this.selectedInterests.splice(index, 1);
}
onClose(): void {
  // You can navigate away, hide the form, or emit an event here.
  this.router.navigate(['/']); // Example: Redirecting to home page
}

}