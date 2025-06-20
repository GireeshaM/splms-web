import { Component, OnInit } from '@angular/core';
import { UrlsService } from '../../../services/urls.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../../navbars/navbar/navbar.component";
import { Router } from '@angular/router';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-my-courses',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './my-courses.component.html',
  styleUrl: './my-courses.component.css'
})
export class MyCoursesComponent implements OnInit {

  enrolledCourses: any[] = [];
  authUserId: number | null = null; // Logged-in user
  instructorUserId: number | null = null; // Will be set per course

  constructor(
    private urlService: UrlsService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private sharedData: SharedDataService
  ) {}

  ngOnInit(): void {
    this.authUserId = this.authService.getUserId();

    if (!this.authUserId) {
      this.toastr.warning('Please log in to view your courses.');
      return;
    }

    this.urlService.getEnrolledCoursesByUserId(this.authUserId).subscribe({
      next: (enrollments) => {
        if (!enrollments || enrollments.length === 0) {
          this.enrolledCourses = [];
          return;
        }

        this.enrolledCourses = [];
        enrollments.forEach((enrollment: any) => {
          const courseId = enrollment.createCourseId || enrollment.CreateCourseId;
          this.urlService.getUserCourseDetails(courseId, this.authUserId!).subscribe({
            next: (courseDetails) => {
              this.sharedData.instructorUserId$.next(courseDetails.userId); // Set the value
              // Set instructorUserId from courseDetails for each course
              this.enrolledCourses.push({
                ...courseDetails,
                enrollmentDate: enrollment.enrollmentDate || enrollment.EnrollmentDate,
                instructorUserId: courseDetails.userId // Make sure this property exists
              });
            },
            error: (err) => {
              // Optionally handle error for individual course fetch
            }
          });
        });
      },
      error: (err) => {
        this.toastr.error('Failed to load enrolled courses.');
        console.error(err);
      }
    });
  }

  getThumbnail(binaryData: any): string {
    return binaryData
      ? `data:image/jpeg;base64,${binaryData}`
      : 'assets/default-thumbnail.jpg';
  }

  onCourseClick(course: any) {
    this.router.navigate(['/course-display', course.createCourseId]);
  }
}