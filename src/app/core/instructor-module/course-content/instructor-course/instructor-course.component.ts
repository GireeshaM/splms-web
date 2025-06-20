import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { HttpService } from '../../../../services/http.service';
import { ToastrService } from 'ngx-toastr';
import { NavbarComponent } from '../../../../navbars/navbar/navbar.component';
import { RouterLink } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-instructor-course',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink, FormsModule],
  templateUrl: './instructor-course.component.html',
  styleUrl: './instructor-course.component.css',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class InstructorCourseComponent implements OnInit {
  instructorCourses: any[] = [];
  filteredCourses: any[] = [];
  loading = true;
  selectedLevel: string = '';
  searchText: string = '';

  // Filters and sorting state
  selectedLevels: string[] = [];
  allLevels: string[] = [
    'Mandatory',
    'Advance',
    'Expert',
    'Intermediate',
    'Beginner',
  ];
  filterAdminReviewed: boolean = false;
  sortOption: 'created' | 'updated' = 'updated';
  sortOrder: 'asc' | 'desc' = 'desc';

  constructor(
    private http: HttpClient,
    private https: HttpService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();

    if (userId) {
      this.http
        .get<any[]>(`https://localhost:7215/api/Course/ByUserId/${userId}`)
        .subscribe({
          next: (data) => {
            this.instructorCourses = data;
            this.applyFiltersAndSorting();
            this.loading = false;
          },
          error: () => {
            this.toastr.error('Failed to load courses');
            this.loading = false;
          },
        });
    } else {
      this.toastr.error('User not authenticated');
      this.loading = false;
    }
  }

  toggleSortOrder(): void {
    this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
    this.applyFiltersAndSorting();
  }

  setSortOption(option: 'created' | 'updated'): void {
    this.sortOption = option;
    this.applyFiltersAndSorting();
  }

 applyFiltersAndSorting(): void {
  let courses = [...this.instructorCourses];

  // Filter by selected level
  if (this.selectedLevel) {
    courses = courses.filter((c) => c.level === this.selectedLevel);
  }

  // Filter by admin review
  if (this.filterAdminReviewed) {
    courses = courses.filter((c) => c.adminReview === true);
  }

  // Filter by search text
  if (this.searchText && this.searchText.trim() !== '') {
    const lowerSearch = this.searchText.trim().toLowerCase();
    courses = courses.filter((c) =>
      c.courseTitle?.toLowerCase().includes(lowerSearch)
    );
  }

  // Sort
  courses.sort((a, b) => {
    const aDate =
      this.sortOption === 'created'
        ? new Date(a.courseCreatedDate)
        : new Date(a.courseUpdatedDate);
    const bDate =
      this.sortOption === 'created'
        ? new Date(b.courseCreatedDate)
        : new Date(b.courseUpdatedDate);
    return this.sortOrder === 'asc'
      ? aDate.getTime() - bDate.getTime()
      : bDate.getTime() - aDate.getTime();
  });

  this.filteredCourses = courses;
}


  sendToAdmin(courseId: number): void {
    this.http
      .patch(
        `https://localhost:7215/api/Course/UpdateAdminReview/${courseId}`,
        {}
      )
      .subscribe({
        next: () => {
          const course = this.instructorCourses.find(
            (c) => c.createCourseId === courseId
          );
          if (course) {
            course.adminReview = true;
            this.applyFiltersAndSorting(); // Refresh view
          }
          this.toastr.success('Course sent to admin.');
        },
        error: () => this.toastr.error('Failed to send course to admin.'),
      });
  }

  deleteCourse(courseId: number): void {
    if (!confirm('Are you sure you want to delete this course?')) return;

    this.http
      .delete(`https://localhost:7215/api/Course/${courseId}`)
      .subscribe({
        next: () => {
          this.instructorCourses = this.instructorCourses.filter(
            (c) => c.createCourseId !== courseId
          );
          this.applyFiltersAndSorting();
          this.toastr.success('Course deleted successfully.');
        },
        error: () => this.toastr.error('Failed to delete course.'),
      });
  }
  clearFilters(): void {
    this.selectedLevel = '';
    this.filterAdminReviewed = false;
    this.sortOption = 'updated';
    this.sortOrder = 'desc';
    this.applyFiltersAndSorting();
  }
}
