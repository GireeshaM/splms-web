import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Category, SubCategory } from '../../../../Basic/Models';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { UrlsService } from '../../../../services/urls.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../navbars/navbar/navbar.component';
import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { QuillModule } from 'ngx-quill';
import { AddFaqsComponent } from "../../User-Engagement/add-faqs/add-faqs.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-course',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    NavbarComponent,
    FormsModule,
    RouterLink,
    QuillModule,
    
],
  templateUrl: './create-course.component.html',
  styleUrl: './create-course.component.css',
})
export class CreateCourseComponent {
  courseForm: FormGroup;
  thumbnailBase64 = '';
  demoVideoFile: File | null = null;
  showInstructions = true;
  demoVideoPreview: string | null = null;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  selectedCategoryId: number | null = null;
  newCategoryName = '';
  newSubCategoryName = '';
  deleteCategoryId!: number;
  deleteSubCategoryId!: number;
  userId: number | null = null;
  courseTitle: string = '';
  showCourseSuccess = false;
  isEditMode = false;
  private readonly INSTRUCTION_TIMEOUT = 10000;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private urlsService: UrlsService,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    this.courseForm = this.initCourseForm();
  }

  ngOnInit(): void {
    this.userId = this.authService.getUserId(); // Ensure this returns the logged-in user's ID
    this.loadCategories();
    setTimeout(() => (this.showInstructions = false), this.INSTRUCTION_TIMEOUT);
    const courseId = this.route.snapshot.paramMap.get('id');
  if (courseId) {
    this.isEditMode = true;
    this.fetchCourseDetails(+courseId);
  }
  }

  isEditingTitle: boolean = false; // toggle state for editing

  toggleEditTitle() {
    this.isEditingTitle = true;
    // Optionally focus the input element after toggling
  }

  finishTitleEdit() {
    this.isEditingTitle = false;
    // Optionally validate or save the title here
  }

  termsAccepted = false;
  acceptedTerms = false;

  onStartCourse() {
    if (this.termsAccepted) {
      this.acceptedTerms = true;
    }
  }
fetchCourseDetails(courseId: number): void {
  this.urlsService.getCourseById(courseId).subscribe({
    next: (course: any) => {
      this.courseForm.patchValue({
        CreateCourseId: course.createCourseId,
        categoryId: course.categoryId,
        courseTitle: course.courseTitle,
        courseDescription: course.courseDescription,
        level: course.level,
        duration: course.duration,
        courseOverview: course.courseOverview,
        preRequirements: course.preRequirements,
        skillsYouGain: course.skillsYouGain,
        whatYouWillLearn: course.whatYouWillLearn
      });
     
      if (course.thumbnail) {
        this.thumbnailBase64 = `data:image/jpeg;base64,${course.thumbnail}`;
      }
      if (course.demoVideoUrl) {
         console.log('Using demoVideoUrl');
        // Case: stored as video URL
        this.demoVideoPreview = course.demoVideoUrl;
      } else if (course.demoVideo && course.demoVideo.trim() !== '') {
        // Case: stored as base64 string (which is your case now)
        console.log('Using base64 demoVideo');
        try {
  const cleanedBase64 = course.demoVideo?.trim();
  if (cleanedBase64 && !cleanedBase64.startsWith('data:')) {
    this.demoVideoPreview = `data:video/mp4;base64,${cleanedBase64}`;
  } else {
    this.demoVideoPreview = cleanedBase64;
  }
} catch (error) {
  console.error('Error setting video preview:', error);
}

      }
      console.log('Raw demoVideo:', course.demoVideo);


console.log(course);
     
      // Now fetch subcategories and only patch subCategoryId in edit mode
      this.selectedCategoryId = course.categoryId;
      this.urlsService.getSubCategories(course.categoryId).subscribe({
        next: (data: SubCategory[]) => {
          this.subCategories = data;
          
          if (this.isEditMode) {
            this.courseForm.patchValue({ subCategoryId: +course.subCategoryId });
          }
        },
        error: () => this.toastr.error('Failed to load subcategories'),
      });
    },
    error: () => {
      this.toastr.error('Failed to load course details.', 'Error');
    }
    
  });
}


  private initCourseForm(): FormGroup {
    return this.fb.group({
      CreateCourseId: [0],

      categoryId: ['',Validators.required],
      subCategoryId: ['',Validators.required],
      courseTitle: ['', Validators.required],
      courseDescription: ['', Validators.required],
      level: ['', Validators.required],
      duration: ['', Validators.required],
      courseOverview: ['', Validators.required],
      preRequirements: ['', Validators.required], // Rich Text
      skillsYouGain: ['', Validators.required], // Rich Text
      whatYouWillLearn: ['', Validators.required], // Rich Text
      thumbnail: [''],
      demoVideo: [''],
    });
  }

  loadCategories(): void {
    this.urlsService.getCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: () => this.toastr.error('Failed to load categories'),
    });
  }
  
  onCategoryChange(categoryId: string | number): void {
    const id = Number(categoryId);
    this.selectedCategoryId = id;
    this.courseForm.patchValue({ subCategoryId: '' });
   
    this.subCategories = [];

    if (!isNaN(id)) {
      this.urlsService.getSubCategories(id).subscribe({
        next: (data: SubCategory[]) => (this.subCategories = data),
        error: () => this.toastr.error('Failed to load subcategories'),
      });
    }
    
  }
  

  handleFileInput(event: Event, field: string): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    if (field === 'demoVideo') {
      this.demoVideoFile = file;

      // Create a temporary URL for preview
      this.demoVideoPreview = URL.createObjectURL(file);
    } else if (field === 'thumbnail') {
      const reader = new FileReader();
      reader.onload = () => {
        this.thumbnailBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.thumbnailBase64 = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  cropImage(): void {
    // Optional: Add cropping logic here
  }

  saveCategoryChanges(): void {
    // Implement saving logic here if needed
    console.log('Save Changes clicked.');
    // For example, you might send updated categories to the server
  }

  convertBase64ToFile(
    base64: string,
    filename: string,
    mimeType: string
  ): File {
    const parts = base64.split(',');
    if (parts.length !== 2) {
      throw new Error('Invalid base64 format');
    }
    const byteString = atob(parts[1]);
    const byteArray = new Uint8Array(
      [...byteString].map((char) => char.charCodeAt(0))
    );
    return new File([byteArray], filename, { type: mimeType });
  }

  onSubmit(): void {
    const action = this.isEditMode ? 'updated' : 'created';
const successTitle = this.isEditMode 
  ? '📝 Course Updated Successfully!' 
  : '🎉 Course Created Successfully!';
const successMessage = this.isEditMode 
  ? 'Your changes have been saved.' 
  : 'Your course has been created. You can now add FAQs or go to the dashboard.';
    if (this.courseForm.invalid) {
      this.toastr.error('Please fill out all required fields.', 'Error');
      return;
    }

    // Ensure user is logged in
    if (!this.userId) {
      this.toastr.error(
        'User not logged in. Please log in and try again.',
        'Error'
      );
      return;
    }

    // Validate rich text fields (strip HTML and check for meaningful content)
    const richTextFields = [
      { key: 'preRequirements', label: 'Pre-requirements' },
      { key: 'skillsYouGain', label: 'Skills You Gain' },
      { key: 'whatYouWillLearn', label: 'What You Will Learn' },
    ];

    for (const { key, label } of richTextFields) {
      const content = this.courseForm.get(key)?.value || '';
      const contentStr = typeof content === 'string' ? content : (content?.toString?.() ?? '');

const plainText = contentStr.replace(/<[^>]*>/g, '').trim();
if (!plainText) {
  this.toastr.error(`${label} cannot be empty.`, 'Error');
  return;
}

      if (!plainText) {
        this.toastr.error(`${label} cannot be empty.`, 'Error');
        return;
      }
    }

    const formData = new FormData();
    const formValue = this.courseForm.getRawValue();

    formData.append('CreateCourseId', formValue.CreateCourseId.toString());
    formData.append('UserId', this.userId.toString());
    formData.append('CategoryId', parseInt(formValue.categoryId, 10).toString());
    formData.append('SubCategoryId', parseInt(formValue.subCategoryId, 10).toString());
    formData.append('CourseTitle', formValue.courseTitle);
    formData.append('CourseDescription', formValue.courseDescription);
    formData.append('Level', formValue.level);
    formData.append('Duration', formValue.duration);
    formData.append('CourseOverview', formValue.courseOverview);
    formData.append('CourseStatus', 'true');  // or 'false' as appropriate
    formData.append('InProgress', 'false');   // set this based on your app logic
    formData.append('AdminReview', 'false');  // usually false initially
    formData.append('IsUploaded', 'true');    // if course is being submitted
   
    // Append the HTML-rich content directly
    formData.append('PreRequirements', formValue.preRequirements);
    formData.append('SkillsYouGain', formValue.skillsYouGain);
    formData.append('WhatYouWillLearn', formValue.whatYouWillLearn);

    try {
      if (this.thumbnailBase64) {
        const file = this.convertBase64ToFile(
          this.thumbnailBase64,
          'thumbnail.png',
          'image/png'
        );
        formData.append('Thumbnail', file);
      }
    } catch {
      this.toastr.error('Invalid thumbnail format.', 'Error');
      return;
    }

      // 1. Try appending the new video if user uploads
        if (this.demoVideoFile) {
          // User uploaded a new video
          formData.append('DemoVideo', this.demoVideoFile);
        } else if (this.isEditMode && this.demoVideoPreview?.startsWith('data:video')) {
          // Reconstruct File object from base64 if preview exists
          try {
            const demoVideoFromBase64 = this.convertBase64ToFile(
              this.demoVideoPreview,
              'demoVideo.mp4',
              'video/mp4'
            );
            formData.append('DemoVideo', demoVideoFromBase64);
          } catch (error) {
            this.toastr.error('Failed to convert existing demo video.', 'Error');
          }
        }



    this.http
      .post('https://localhost:7215/api/Course/CreateOrUpdate', formData)
      .subscribe({
       next: (res: any) => {
  this.toastr.success('Course created successfully!', 'Success');
  this.courseForm.reset();
  this.thumbnailBase64 = '';
  this.demoVideoFile = null;
  this.subCategories = [];
  this.selectedCategoryId = null;
  const createdCourseId = res.createCourseId || res.id; // Adjust depending on your API
Swal.fire({
  icon: 'success',
  title: this.isEditMode
    ? '📝 Course Updated Successfully!'
    : '🎉 Course Created Successfully!',
  text: this.isEditMode
    ? 'Your changes have been saved.'
    : 'Your course has been created.',
  showConfirmButton: false,
  timer: 2000,
  allowOutsideClick: false,
  allowEscapeKey: false,
  customClass: {
    popup: 'swal2-large-popup',
    title: 'swal2-large-title',
    htmlContainer: 'swal2-large-text'
  }
});
setTimeout(() => {
  window.location.href = '/instructor-dashboard';
}, 2000);


}

      });
  }

  addNewCategory() {
    const category = {
      name: 'New Category Name',
    };

    this.urlsService.addCategory(category).subscribe({
      next: (res) => {
        console.log('Category added:', res);
      },
      error: (err) => {
        console.error('Error adding category:', err);
      },
    });
  }

  addNewSubCategory() {
    const subCategory = {
      name: 'New SubCategory Name',
      categoryId: '', // set the relevant category id here
    };

    this.urlsService.addSubCategory(subCategory).subscribe({
      next: (res) => {
        console.log('SubCategory added:', res);
      },
      error: (err) => {
        console.error('Error adding subcategory:', err);
      },
    });
  }

  // Triggered by + Add Category button
  openAddCategoryModal(): void {
    Swal.fire({
      title: 'Enter new category name',
      input: 'text',
      inputPlaceholder: 'Category name',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Category name is required';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newCategory: Category = { name: result.value } as Category;
        this.urlsService.addCategory(newCategory).subscribe(() => {
          this.loadCategories(); // reload after adding

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Category added!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  }

  openAddSubCategoryModal(): void {
    const categoryId = this.courseForm.get('categoryId')?.value;
    if (!categoryId) {
      Swal.fire('Please select a category first.', '', 'warning');
      return;
    }

    Swal.fire({
      title: 'Enter new subcategory name',
      input: 'text',
      inputPlaceholder: 'Subcategory name',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      inputValidator: (value) => {
        if (!value) {
          return 'Subcategory name is required';
        }
        return null;
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newSubCategory: SubCategory = {
          name: result.value,
          categoryId,
        } as SubCategory;

        this.urlsService.addSubCategory(newSubCategory).subscribe(() => {
          this.onCategoryChange(categoryId); // reload subcategories

          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Subcategory added!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
      }
    });
  }

  simpleQuillModules = {
  toolbar: [
    ['bold', 'italic'], // Bold & Italic
    [{ list: 'ordered' }, { list: 'bullet' }], // Numbered and Bullet lists
  ],
};
}