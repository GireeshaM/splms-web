import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/authentication/auth.service';

@Component({
  selector: 'app-create-course',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.scss']
})
export class CreateCourseComponent implements OnInit {
  courseForm: FormGroup;
  categories: any[] = [];
  subCategories: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      categoryId: ['', Validators.required],
      subCategoryId: ['', Validators.required],
      demoVideoUrl: ['', Validators.required],
      duration: ['', Validators.required],
      whatYouWillLearn: ['', Validators.required],
      thumbnail: ['', Validators.required],
      preRequisites: ['', Validators.required],
      description: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.authService.getCategories().then((data: any[]) => {
      console.log('Categories received:', data);
      this.categories = data; // Populate categories from the backend
    }).catch((err) => {
      console.error('Error fetching categories:', err);
    });
  }

  onCategoryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const categoryId = target.value;

    if (!categoryId) {
      this.subCategories = [];
      this.courseForm.patchValue({ subCategoryId: '' });
      return;
    }

    // Fetch subcategories based on the selected category
    this.authService.getSubCategoriesByCategoryId(Number(categoryId)).then((data: any[]) => {
      this.subCategories = data;
      this.courseForm.patchValue({ subCategoryId: '' });
    }).catch((err: any) => {
      console.error('Error loading subcategories:', err);
    });
  }

  onSubmit(): void {
    if (this.courseForm.invalid) {
      alert('Please fill out all required fields.');
      return;
    }
  
    const userId = this.authService.getUserIdFromToken();
    if (!userId) {
      alert('User ID not found. Please log in again.');
      return;
    }
  
    const payload = {
      ...this.courseForm.value,
      userId: Number(userId)
    };
  
    console.log('Payload being sent:', payload); // Log the payload
  
    this.authService.createCourse(payload).subscribe({
      next: (res) => {
        alert('Course created successfully!');
        this.courseForm.reset();
      },
      error: (err) => {
        console.error('Course creation error:', err);
      }
    });
  }

  thumbnailBase64: string = '';
demoVideoBase64: string = '';

onThumbnailSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      this.thumbnailBase64 = reader.result as string;
      this.courseForm.patchValue({ thumbnail: this.thumbnailBase64 }); // Update the form control
      console.log('Thumbnail selected and form updated:', this.courseForm.value);
    };
    reader.readAsDataURL(file); // base64 encode image
  }
}

onVideoSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    // Check if the file size exceeds 1GB (1GB = 1024 * 1024 * 1024 bytes)
    if (file.size > 1024 * 1024 * 1024) {
      alert('File size exceeds 1GB. Please select a smaller file.');
      this.courseForm.patchValue({ demoVideoUrl: '' }); // Reset the form control
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.demoVideoBase64 = reader.result as string;
      this.courseForm.patchValue({ demoVideoUrl: this.demoVideoBase64 }); // Update the form control
      console.log('Video selected and form updated:', this.courseForm.value);
    };
    reader.readAsDataURL(file); // base64 encode video
  }
}
}