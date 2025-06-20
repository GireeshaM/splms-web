import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../../../../services/urls.service';
import { ToastrService } from 'ngx-toastr';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Course } from '../../instructor-models';
import { AuthService } from '../../../../services/auth.service';
import { NavbarComponent } from "../../../../navbars/navbar/navbar.component";

@Component({
  selector: 'app-add-faqs',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, NavbarComponent],
  templateUrl: './add-faqs.component.html',
  styleUrl: './add-faqs.component.css',
  animations: [
    trigger('expandCollapse', [
      state('collapsed', style({ height: '0', overflow: 'hidden', opacity: 0 })),
      state('expanded', style({ height: '*', opacity: 1 })),
      transition('collapsed <=> expanded', [animate('300ms ease-in-out')])
    ])
  ]
})
export class AddFaqsComponent implements OnInit {
 
  faqForm!: FormGroup;                                                                                                        
  faqExpanded: boolean[] = [];
  isEditing: boolean[] = [];
  courses: Course[] = [];
  selectedCourseId!: number;

  constructor(
    private fb: FormBuilder,
    private urlsService: UrlsService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initForm();
    // this.loadFaqs();
    this.loadCoursesForLoggedInUser();
  }
 loadCoursesForLoggedInUser(): void {
  const userId = this.authService.getUserId();
  console.log('User ID:', userId);
  if (userId !== null) {
    this.urlsService.getCoursesByUserId(userId).subscribe({
       next: (courses: Course[]) => {
    console.log('Fetched courses:', courses);
    this.courses = courses;
  },
      error: (err) => {
        console.error('Failed to load courses:', err);
      }
    });
  } else {
    console.warn('User is not logged in.');
  }
}
onCourseChange(courseId: number) {
  this.selectedCourseId = courseId;

  // Update the form control for existing FAQs as well
  this.faqList.controls.forEach(faqGroup => {
    faqGroup.patchValue({ createCourseId: courseId });
  });

  this.loadFaqs(courseId);
}

  initForm() {
    this.faqForm = this.fb.group({
      selectedCourseId: [null],
      faqList: this.fb.array([])
    });
  }

  get faqList(): FormArray {
    return this.faqForm.get('faqList') as FormArray;
  }

  toggleFaqExpand(index: number): void {
    this.faqExpanded[index] = !this.faqExpanded[index];
  }

  addFaq(existingFaq: any = null) {
    const faqGroup = this.fb.group({
      courseFaqsId: [existingFaq?.courseFaqsId || 0],
      createCourseId: [this.selectedCourseId],
      faqQuestion: [existingFaq?.faqQuestion || '', Validators.required],
      faqAnswer: [existingFaq?.faqAnswer || '']
    });

const index = this.faqList.length;
  this.faqList.push(faqGroup);
  this.faqExpanded[index] = false;
  this.isEditing[index] = false;

  // Track changes and enable Save button
  faqGroup.valueChanges.subscribe(() => {
    this.isEditing[index] = true;
  });
  }

  removeFaq(index: number) {
    this.faqList.removeAt(index);
  }

  editFaq(index: number): void {
    this.isEditing[index] = true;
  }

 saveSingleFaq(index: number): void {
  const faq = this.faqList.at(index);
  const faqData = faq.value;
  this.isEditing[index] = false;
  console.log('Saving FAQ:', faqData);
  this.urlsService.addOrUpdateFaq(faqData).subscribe({
    next: () => {
      this.toastr.success('FAQ saved successfully');
      this.loadFaqs();
    },
    error: () => {
      this.toastr.error('Failed to save FAQ');
    }
  });
}


  saveFaqs(): void {
    for (let i = 0; i < this.faqList.length; i++) {
      const faq = this.faqList.at(i).value;
      faq.createCourseId = this.selectedCourseId;

      const request$ = faq.courseFaqsId && faq.courseFaqsId !== 0
        ? this.urlsService.updateAnswer(faq.courseFaqsId, faq)
        : this.urlsService.addOrUpdateFaq(faq);

      request$.subscribe({
        next: () => {
          this.toastr.success('FAQ saved successfully');
          this.loadFaqs();
        },
        error: () => {
          this.toastr.error('Failed to save FAQ');
        }
      });
    }
  }

  deleteFaq(index: number, id: number) {
  if (!id || id === 0) {
    // Just remove from the form if it's not saved to backend
    this.faqList.removeAt(index);
    return;
  }

  if (confirm('Are you sure you want to delete this FAQ?')) {
    this.urlsService.deleteFaq(id).subscribe({
      next: () => {
        this.toastr.success('FAQ deleted');
        this.faqList.removeAt(index);
      },
      error: () => {
        this.toastr.error('Failed to delete FAQ');
      }
    });
  }
}


loadFaqs(courseId: number | undefined = this.selectedCourseId) {
  if (!courseId) {
    // No course selected yet, don't call API
    this.faqList.clear();
    return;
  }
  
  this.urlsService.getFaqsByCourseId(courseId).subscribe({
    next: (data) => {
      this.faqList.clear();
      this.faqExpanded = [];
      this.isEditing = [];

      data.forEach((faq, index) => {
        this.addFaq(faq);
        this.faqExpanded[index] = false;
        this.isEditing[index] = false;
      });
    },
    error: () => {
      this.toastr.error('Failed to load FAQs');
    }
  });
}


}