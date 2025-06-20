import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../services/api.service';
import { Role } from '../../Basic/Models';
import { LoginComponent } from '../login/login.component';
import { CommonModule } from '@angular/common';
import { PhoneNumberDirective } from '../../Directives/phone-number.directive';
// import { isValidPhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule,PhoneNumberDirective],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showRegisterModal: boolean = true;
  roles: Role[] = [];
 showPassword = false;
showConfirmPassword = false;
countryCodes = [
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  // Add more countries as needed
];

  countryList = this.countryCodes;
  selectedCountry = this.countryList[0];



  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
     this.route.queryParams.subscribe((params) => {
    if (params['showLogin']) {
      this.showRegisterModal = false;
    } else {
      this.showRegisterModal = true;
    }
  });

    this.getRoles();
    this.initializeForm();
    this.watchConfirmPassword();
  }

  
  initializeForm() {
    this.registerForm = this.fb.group(
      {
        fullName: ['', [Validators.required]],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            // Validators.pattern(
            //   /^[^\s@]+@([a-zA-Z0-9-]+\.)?(outlook|hotmail|live|msn|gmail|yahoo|company|university|ngo|startup)\.(com|in|co\.uk|net|edu|org|io|co\.in)$/i
            // ),
            Validators.pattern(/^[^\s@]+@([a-zA-Z-]+\.)+[a-zA-Z]{2,}$/),
            this.noWhitespaceValidator,
            this.noSpecialCharsValidator,
          ],
        ],
       
      countryCode: [this.selectedCountry.code, Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        rolesId: ['', Validators.required], // <-- set to '' not 1
      },
      { validators: this.passwordMatchValidator }
    );
  }



  passwordMatchValidator(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  watchConfirmPassword() {
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      const password = this.registerForm.get('password')?.value;
      const confirmPassword = this.registerForm.get('confirmPassword')?.value;

      if (password && confirmPassword && password !== confirmPassword) {
        this.registerForm.get('confirmPassword')?.setErrors({ mismatch: true });
      } else {
        this.registerForm.get('confirmPassword')?.setErrors(null);
      }
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  getRoles() {
    this.apiService.get<any[]>('https://localhost:7215/api/Roles').subscribe(
      (data) => {
        this.roles = data;
      },
      (error) => {
        this.toastr.error('Failed to load roles', 'Error');
      }
    );
  }

onSubmit() {
  if (this.registerForm.valid) {
      const phoneNumber = this.registerForm.value;
      console.log('Form Submitted:', phoneNumber);
    }
  if (this.registerForm.invalid) {
    this.toastr.error('Please correct the errors in the form', 'Error');
    return;
  }

  const user = this.registerForm.value;

  this.apiService
    .post('https://localhost:7215/api/auth/register', user)
    .subscribe(
      () => {
        this.toastr.success('Registration successful', 'Success');

        // Redirect to login modal after successful registration
        this.router.navigate([], {
          queryParams: { showRegister: null, showLogin: true },
          queryParamsHandling: 'merge', // This ensures other query params are preserved
        });   
      },
      (error) => {
        if (error.error.errors) {
          const validationErrors = Object.values(
            error.error.errors as Record<string, unknown>
          )
            .map((messages) => (messages as string[]).join(', '))
            .join('\n');

          this.toastr.error(validationErrors, 'Validation Errors');
        } else {
          this.toastr.error('An error occurred during registration', 'Error');
        }
      }
    );
}




  closeModal(): void {
  this.router.navigate([], {
    queryParams: { showRegister: null },
    queryParamsHandling: 'merge',
  });
  this.showRegisterModal = false;
}



  goToLogin(): void {
    // this.dialogRef.close();
    // this.dialog.open(LoginComponent, {
    //   width: '400px',
    //   disableClose: false,
    //   backdropClass: 'custom-backdrop',
    // });
     this.router.navigate(['/home'], { queryParams: { showLogin: true } });
  this.showRegisterModal = false;
  }

  noWhitespaceValidator(control: import('@angular/forms').AbstractControl) {
  const isWhitespace = (control.value || '').toString().trim().length === 0;
  return !isWhitespace ? null : { whitespace: true };
}

noSpecialCharsValidator(control: import('@angular/forms').AbstractControl) {
  // Only allow letters, numbers, dots, underscores, and hyphens before @
  return /^[a-zA-Z0-9._-]+@[^\s@]+$/.test(control.value || '')
    ? null
    : { specialChars: true };
}

// phoneNumberValidator(control: AbstractControl): { [key: string]: boolean } | null {
//   const phone = control.value;
//   const countryCode = this.registerForm.get('countryCode')?.value || '+1';
//   const fullNumber = countryCode + phone;

//   if (!phone) {
//     return null;
//   }

//   if (isValidPhoneNumber(fullNumber)) {
//     return null;
//   } else {
//     return { invalidPhone: true };
//   }
// }


onCountryChange(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const code = selectElement.value;
  this.selectedCountry = this.countryList.find(c => c.code === code) || this.countryList[0];
  this.registerForm.patchValue({ countryCode: this.selectedCountry.code });
}

}