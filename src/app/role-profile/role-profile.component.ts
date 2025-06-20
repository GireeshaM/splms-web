import {
  Component,
  ElementRef,
  ViewChild,
  VERSION,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { UrlsService } from '../services/urls.service';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbars/navbar/navbar.component';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { catchError, of, throwError } from 'rxjs';
import {
  Country,
  State,
  City,
  ICountry,
  IState,
  ICity,
} from 'country-state-city';

// Import ToastrService here:
import { ToastrService } from 'ngx-toastr';
import { UserRegisterDto } from '../home/homeModel';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-role-profile',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './role-profile.component.html',
  styleUrl: './role-profile.component.css',
  animations: [
    trigger('tabSwitchAnimation', [
      transition('* <=> *', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
  ],
})
export class RoleProfileComponent implements OnInit {
  profileForm!: FormGroup;
  userId: number | null = null;
  fullName: string = '';
  isEditMode = false;
  loading = false;
  activeTab: 'personal' | 'education' = 'personal';
  dropdownOpen = false;

  @ViewChild('video', { static: false }) video!: ElementRef<HTMLVideoElement>;

  name = 'Angular ' + VERSION.major;
  countries: ICountry[] = Country.getAllCountries();
  states: IState[] | null = null;
  cities: ICity[] | null = null;

  selectedCountry: ICountry | null = null;
  selectedState: IState | null = null;
  selectedCity: ICity | null = null;

  previewImage: string | null = null;
  capturedImage: string | null = null;
  isCameraOn = false;
  mediaStream: MediaStream | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private urlsService: UrlsService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    if (!this.userId) return;

    this.initForm(); // 🔄 Make sure form is initialized BEFORE patching

    this.authService.getUserById(this.userId).subscribe({
      next: (user) => {
        this.fullName = user.fullName;

        this.profileForm.patchValue({
          email: user.email,
          phoneNumber: user.phoneNumber,
          fullName: user.fullName,
        });
      },
      error: () => {
        this.toastr.error('Failed to load user information');
      },
    });

    this.loadOrInitializeProfile(this.userId);
  }

  
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}

  initForm(): void {
    this.profileForm = this.fb.group({
      userId: [this.userId],
      rolesId: [this.authService.getUserRoleId(), Validators.required],
      fullName: [{ value: '', disabled: true }], // ✅ Disabled here
      email: [{ value: '', disabled: true }],
      phoneNumber: [{ value: '', disabled: true }],
      dateOfBirth: [''], // no Validators.required
      gender: [''],
      maritalStatus: [''],
      alternateMobileNumber: [''],
      highestQualification: [''],
      qualificationStream: [''],
      collegeName: [''],
      passedOutYear: [''],
      designation: [''],
      jobTitle: [''],
      city: [''],
      state: [''],
      country: [''],
      photoPath: [''],
      linkedInUrl: [''],
      gitHubUrl: [''],
      experience: [''],
      createDate: [new Date().toISOString()],
      updateDate: [new Date().toISOString()],
    });
  }

  loadOrInitializeProfile(userId: number): void {
    this.loading = true;

    this.urlsService
      .getProfileByUserId(userId)
      .pipe(
        catchError((err) => {
          this.loading = false;
          if (err.status === 404) {
            this.isEditMode = false;
            return of(null);
          } else {
            console.error('❌ Unexpected error loading profile:', err);
            this.toastr.error(
              'Something went wrong while loading the profile.'
            );
            return throwError(() => err);
          }
        })
      )
      .subscribe((profile) => {
        this.loading = false;

        if (!profile) return;

        this.isEditMode = true;

        if (profile.dateOfBirth) {
          profile.dateOfBirth = new Date(profile.dateOfBirth)
            .toISOString()
            .split('T')[0];
        }

        // Convert country/state/city strings to objects
        const selectedCountry = Country.getAllCountries().find(
          (c) => c.name === profile.country
        );

        if (selectedCountry) {
          this.states = State.getStatesOfCountry(selectedCountry.isoCode);
          const selectedState = this.states.find(
            (s) => s.name === profile.state
          );

          if (selectedState) {
            this.cities = City.getCitiesOfState(
              selectedCountry.isoCode,
              selectedState.isoCode
            );
            const selectedCity =
              this.cities.find((c) => c.name === profile.city) ?? null;

            this.selectedCountry = selectedCountry;
            this.selectedState = selectedState;
            this.selectedCity = selectedCity;

            this.profileForm.patchValue({
              ...profile,
              country: selectedCountry,
              state: selectedState,
              city: selectedCity,
            });
          } else {
            this.selectedCountry = selectedCountry;
            this.states = [];
            this.cities = [];
            this.profileForm.patchValue({
              ...profile,
              country: selectedCountry,
              state: null,
              city: null,
            });
          }
        } else {
          this.states = [];
          this.cities = [];
          this.selectedCountry = null;
          this.selectedState = null;
          this.selectedCity = null;
          this.profileForm.patchValue(profile);
        }

        if (profile.photoPath) {
          this.previewImage = profile.photoPath;
        } else {
          this.previewImage = null;
        }
      });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    const formValue = this.profileForm.getRawValue();

    // Convert empty strings to null for optional fields
    const profile = {
      ...formValue,
      country: formValue.country?.name || '',
      state: formValue.state?.name || '',
      city: formValue.city?.name || '',
      dateOfBirth: formValue.dateOfBirth ? formValue.dateOfBirth : null,
      passedOutYear: formValue.passedOutYear ? formValue.passedOutYear : null,
      experience: formValue.experience ? formValue.experience : null,
    };

    if (this.isEditMode) {
      const confirmed = window.confirm(
        'Are you sure you want to save the changes?'
      );
      if (!confirmed) return;
    }

    this.urlsService.saveProfile(profile).subscribe({
      next: () => {
        const msg = this.isEditMode
          ? 'Profile updated successfully!'
          : 'Profile created successfully!';
        this.toastr.success(msg);
      },
      error: (err) => {
        console.error('Error saving profile:', err);
        if (err.error && err.error.errors) {
          const messages = Object.values(err.error.errors).flat();
          this.toastr.error(messages.join('\n'), 'Validation Error');
        } else {
          this.toastr.error('Something went wrong while saving the profile.');
        }
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      this.toastr.error(
        'Invalid file format. Only JPG, JPEG, PNG are allowed.'
      );
      return;
    }

    // Validate file size (<1MB)
    if (file.size > 1 * 1024 * 1024) {
      this.toastr.error('File size must be less than 1 MB.');
      return;
    }

    // Read and preview image
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      this.capturedImage = null; // clear webcam image if any

      // Set the photoPath in the form (you can store base64 or upload separately)
      this.profileForm.patchValue({ photoPath: this.previewImage });
    };
    reader.readAsDataURL(file);
  }

  // Webcam start
  async startCamera(): Promise<void> {
    try {
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      this.isCameraOn = true;

      // Wait for the video element to be available after rendering
      setTimeout(() => {
        if (this.video && this.video.nativeElement) {
          this.video.nativeElement.srcObject = this.mediaStream;
        } else {
          this.toastr.error('Video element not ready.');
        }
      }, 0);

      this.previewImage = null;
    } catch (err) {
      console.error('Error accessing webcam:', err);
      this.toastr.error('Cannot access webcam.');
    }
  }

  // Webcam stop
  stopCamera(): void {
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.isCameraOn = false;
  }

  // Capture image from webcam video
  captureImage(): void {
    if (!this.video) return;

    const videoEl = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/png');

    this.capturedImage = imageData;
    this.previewImage = null;
    this.profileForm.patchValue({ photoPath: imageData });

    // Stop camera after capture if you want
    this.stopCamera();
  }

  onCountryChange(): void {
    const country = this.profileForm.get('country')?.value;
    if (country) {
      this.states = State.getStatesOfCountry(country.isoCode);
    } else {
      this.states = [];
    }

    this.cities = [];
    this.profileForm.patchValue({ state: null, city: null });
    this.selectedCountry = country;
    this.selectedState = null;
    this.selectedCity = null;
  }

  onStateChange(): void {
    const country = this.profileForm.get('country')?.value;
    const state = this.profileForm.get('state')?.value;

    if (country && state) {
      this.cities = City.getCitiesOfState(country.isoCode, state.isoCode) || [];
    } else {
      this.cities = [];
    }

    this.profileForm.patchValue({ city: null });
    this.selectedState = state;
    this.selectedCity = null;
  }

  onCityChange(): void {
    const city = this.profileForm.get('city')?.value;
    this.selectedCity = city;
  }

  clear(type: string): void {
    switch (type) {
      case 'country':
        this.selectedCountry = null;
        this.selectedState = null;
        this.selectedCity = null;
        this.states = [];
        this.cities = [];
        this.profileForm.patchValue({ country: null, state: null, city: null });
        break;
      case 'state':
        this.selectedState = null;
        this.selectedCity = null;
        this.cities = [];
        this.profileForm.patchValue({ state: null, city: null });
        break;
      case 'city':
        this.selectedCity = null;
        this.profileForm.patchValue({ city: null });
        break;
    }
  }

  getFlagEmoji(countryCode: string): string {
    if (!countryCode) return '';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  selectCountry(country: ICountry) {
  this.selectedCountry = country;
  this.dropdownOpen = false;
  // Update the form control value too:
  this.profileForm.patchValue({ country: country });
  this.onCountryChange(); // trigger any extra logic
}

}