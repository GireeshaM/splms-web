import { Component, OnInit } from '@angular/core';
import {
  CourseSection,
  CreateCourse,
  MyProfiles,
  QuizDto1,
  User,
  Video,
} from '../../../../sections/section-model';
import { Category, SubCategory } from '../../../../Basic/Models';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../../../../services/urls.service';
import { AuthService } from '../../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../../../navbars/navbar/navbar.component';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-course-preview',
  imports: [ReactiveFormsModule, CommonModule, NavbarComponent],
  templateUrl: './course-preview.component.html',
  styleUrls: ['./course-preview.component.css'], // ✅ Fixed
})
export class CoursePreviewComponent implements OnInit {
  courseId!: number;
  categoryId!: number;
  subCategoryId!: number;
  course!: CreateCourse;
  isLoading = true;
  categories: Category[] = [];
  subCategories: SubCategory[] = [];
  user?: User;
  sections: CourseSection[] = [];
  totalSections = 0;
  totalVideoCount = 0;
  totalVideoDuration = 0;
  showAllSkills = false;
  userProfile?: MyProfiles;
  faqs: any[] = [];
  showMore = false;

  expandedIndex: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private urlService: UrlsService,
    private authService: AuthService,
    private toastr: ToastrService
  ) {}
  loadCategories(): void {
    this.urlService.getCategories().subscribe({
      next: (data: Category[]) => (this.categories = data),
      error: () => this.toastr.error('Failed to load categories'),
    });
  }
  loadSubCategories(categoryId: number): void {
    this.urlService.getSubCategories(categoryId).subscribe({
      next: (data: SubCategory[]) => {
        this.subCategories = data;
      },
      error: () => this.toastr.error('Failed to load subcategories'),
    });
  }
  get hasManySkills(): boolean {
    return (this.course?.skillsYouGain?.length ?? 0) > 5;
  }
  toggleFaq(index: number): void {
    this.expandedIndex = this.expandedIndex === index ? null : index;
  }

  get displayedSkills(): string[] {
    if (!this.course?.skillsYouGain) return [];

    // Join all parts into one HTML string
    const combined = this.course.skillsYouGain.join('');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = combined;

    // Extract all <li> elements as clean skill strings
    const listItems = Array.from(tempDiv.querySelectorAll('li')).map(
      (li) => li.textContent?.replace(/\s+/g, ' ').trim() ?? ''
    );

    return this.showAllSkills ? listItems : listItems.slice(0, 5);
  }

  shouldShowSkillToggle(): boolean {
    return this.course?.skillsYouGain && this.course.skillsYouGain.length > 3;
  }

  toggleSkills() {
    this.showAllSkills = !this.showAllSkills;
  }
  ngOnInit(): void {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadCategories();
    this.loadFaqs();

    // 1) Load course + user info
    this.urlService.getCourseById(this.courseId).subscribe({
      next: (data) => {
        this.course = data;
        this.categoryId = data.categoryId;
        this.subCategoryId = data.subCategoryId;
        this.loadSubCategories(this.categoryId);
        // console.log(data);
        if (this.course.demoVideo) {
          this.course.demoVideo = `data:video/mp4;base64,${this.course.demoVideo}`;
        }
        this.urlService.getUserById1(this.course.userId).subscribe({
          next: (u) => (this.user = u),
          error: (err) => console.error('Error fetching user:', err),
        });
        this.urlService.getProfilesByUserId(this.course.userId).subscribe({
          next: (profile) => {
            this.userProfile = profile;
            console.log(this.userProfile);
          },
          error: (err) => {
            console.error('Error fetching profile:', err);
          },
        });

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error fetching course', err);
        this.isLoading = false;
      },
    });

    // 2) Load sections, then for each: fetch videos, get durations, fetch quizzes
    this.urlService.getCourseSectionById(this.courseId).subscribe({
      next: (sectionData: CourseSection[]) => {
        this.sections = sectionData;
        this.totalSections = sectionData.length;

        const videoObservables = this.sections.map((section) =>
          this.urlService.getVideosBySectionId(section.sectionId)
        );

        forkJoin(videoObservables).subscribe({
          next: (videosBySection: Video[][]) => {
            let totalVideoCount = 0;
            let totalVideoDuration = 0;

            this.sections.forEach((section, index) => {
              const videos = videosBySection[index];

              section.video = videos.map((video) => {
                totalVideoCount++;
                totalVideoDuration += video.videoDuration || 0;
                console.log(totalVideoCount);
                return {
                  ...video,
                  videoUrl: `https://localhost:7215/api/Video/section/${section.sectionId}/videos`,
                };
              });
            });

            console.log('📼 Total Videos:', totalVideoCount);
            console.log(
              '⏱ Total Duration (minutes):',
              totalVideoDuration.toFixed(2)
            );

            // Store or display these values as needed
            this.totalVideoCount = totalVideoCount;
            this.totalVideoDuration = totalVideoDuration;
          },
          error: (err) => {
            console.error('Error fetching videos for sections', err);
          },
        });

        this.sections.forEach((section) => {
          // 2a) Fetch videos
          this.urlService.getVideosBySectionId(section.sectionId).subscribe({
            next: (videos: Video[]) => {
              console.log('Videos for section', section.sectionId, videos);

              // Attach the correct video URL and use videoDuration
              section.video = videos.map((video) => ({
                ...video,
                videoUrl: `https://localhost:7215/api/Video/section/${section.sectionId}/videos`,
                videoDuration: video.videoDuration, // <-- This line ensures duration is retained
              }));

              // Optional: log durations
              section.video.forEach((v) =>
                console.log(`Video ${v.videoId} duration: ${v.videoDuration}`)
              );
            },
            error: (err) => {
              console.error(
                `Error fetching videos for section ${section.sectionId}`,
                err
              );
            },
          });

          // 2b) Fetch quizzes
          this.urlService.getQuizBySection(section.sectionId).subscribe({
            next: (quizzes: QuizDto1[]) => {
              section.quiz = quizzes;
            },
            error: (err) => {
              console.error(
                `Error fetching quizzes for section ${section.sectionId}`,
                err
              );
            },
          });
        });
      },
      error: (err) => {
        console.error('Error fetching sections', err);
      },
    });
  }

  getTotalDurationInHours(): number {
    return +(this.totalVideoDuration / 3600).toFixed(2); // Two decimal places
  }

  getFallbackPhoto(): string {
    if (this.userProfile?.photoPath?.startsWith('data:image')) {
      return this.userProfile.photoPath;
    }
    return 'https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg';
  }
  loadFaqs(): void {
    this.urlService.getFaqsByCourseId(this.courseId).subscribe({
      next: (data) => {
        this.faqs = data;
        console.log('FAQs array:', this.faqs);
        console.log(
          'FAQ answers:',
          this.faqs.map((f) => f.faqAnswer)
        );

        console.log(data);
      },
      error: (err) => {
        console.error('Failed to load FAQs', err);
      },
    });
  }
  getCategoryName(): string {
    const category = this.categories.find(
      (c) => c.categoriesId === this.categoryId
    );
    return category ? category.name : 'Unknown Category';
  }
  getSubCategoryName(): string {
    const subCategory = this.subCategories.find(
      (sc) => sc.subCategoriesId === this.subCategoryId
    );
    return subCategory ? subCategory.name : 'Unknown Subcategory';
  }
}
