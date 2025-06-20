import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../navbars/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../../../services/urls.service';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { animate, style, transition, trigger } from '@angular/animations';
import { forkJoin, map } from 'rxjs';
import { MyProfiles, User, VideoSummaryDto } from '../../../sections/section-model';
import { Router } from '@angular/router';
type FilterType = 'category' | 'subCategory' | 'level' | 'duration' | 'skill';
type FilterValue = string | number;
interface Category {
  id: number;
  name: string;
}
interface SubCategory {
  id: number;
  name: string;
}
interface Course {
  id: number;
  name: string;
  categoryId?: number;
  subCategoryId?: number;
  level?: string;
  duration?: string;
  skillsYouGain?: string[];
  enrolled?: boolean;
  createCourseId?: number;
  isEnrolled?: boolean;
  category?: Category;
  subCategory?: SubCategory;
  isWishlisted?: boolean;
  [key: string]: any;
}
@Component({
  selector: 'app-explore-courses',
  standalone: true,
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './explore-courses.component.html',
  styleUrls: ['./explore-courses.component.css'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class ExploreCoursesComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  searchQuery = '';
  sectionIds: number[] = [];
  categories: Category[] = [];
  subcategories: SubCategory[] = [];
  levels: string[] = [];
  durations: string[] = [];
  skills: string[] = [];
  videoDurationsBySection: { [sectionId: number]: string[] } = {};
  videosBySection: { [sectionId: number]: any[] } = {};
  totalVideoSeconds: number = 0;
  totalFormattedDuration: string = '';
  courseDurations: { [courseId: number]: number } = {}; // total seconds
  formattedDurations: { [courseId: number]: string } = {};
  userWishlistCourseIds: number[] = [];
  userId: number | null = null;
  currentPage = 1;
  pageSize = 8;
  modalVisible: boolean = false;
  modalType: FilterType | null = null;
  modalItems: { label: string; value: FilterValue }[] = [];
  modalSelections: Set<FilterValue> = new Set<FilterValue>();
  selectedFilters: Record<FilterType, Set<FilterValue>> = {
    category: new Set(),
    subCategory: new Set(),
    level: new Set(),
    duration: new Set(),
    skill: new Set(),
  };
      sidebarVisible = false;
      showAllCourses = true;
        constructor(
          private urlService: UrlsService,
          private authService: AuthService,
          private toastr: ToastrService,
          private router: Router
        ) {}
      ngOnInit(): void {
        this.userId = this.authService.getUserId();
        
            if (this.userId) {

              
      this.urlService.getUserWishlist(this.userId).subscribe({
        next: (wishlistItems) => {
          // Assuming each item contains createCourseId
          this.userWishlistCourseIds = wishlistItems.map(item => item.createCourseId);
          this.markWishlistedCourses();
        },
        error: (err) => console.error('Failed to fetch wishlist', err),
      });
    } 
    
        this.loadInitialData();

      }
      loadInitialData(): void { 
        this.urlService.getAllCourses().subscribe((data) => {
          console.log(this.userId);
          this.courses = data.map((course: any) => ({
            ...course,
            isEnrolled: course.enrolled ?? false,
            categoryId: course.categoryId ?? course.category?.id,
            subCategoryId: course.subCategoryId ?? course.subCategory?.id,
          }));
          
        
          this.applyFilters();
            this.courses.forEach(course => {
            const courseId = course.createCourseId ?? course.id;
            if (courseId) {
              this.computeTotalDurationForCourse(courseId);
            }
            
          });
          this.markWishlistedCourses();
        });
        this.urlService.getCategories().subscribe((data) => {
          this.categories = data.map((cat: any) => ({
            id: cat.categoriesId,
            name: cat.name,
          }));
        });
        this.urlService.getCoursesSubCategories().subscribe((data) => {
          this.subcategories = data.map((sub: any) => ({
            id: sub.subCategoriesId,
            name: sub.name,
          }));
        });
        this.urlService.getLevels().subscribe((data) => (this.levels = data));
        this.urlService.getDurations().subscribe((data) => (this.durations = data));
        this.urlService.getSkills().subscribe((data) => (this.skills = data));
      }
      markWishlistedCourses(): void {
        this.courses.forEach(course => {
          const courseId = course.createCourseId ?? course.id;
          course.isWishlisted = this.userWishlistCourseIds.includes(courseId);
        });
      }
      fetchVideosForSections(): void {
        this.totalVideoSeconds = 0;
        const fetches = this.sectionIds.map(sectionId =>
          this.urlService.getVideosBySectionId(sectionId).pipe(
            map((videos: VideoSummaryDto[]) => {
              videos.forEach((video: VideoSummaryDto) => {
                this.totalVideoSeconds += video.videoDuration;
              });
            })
          )
        );
        forkJoin(fetches).subscribe({
          next: () => {
            this.totalFormattedDuration = this.formatDuration(this.totalVideoSeconds);
            console.log('Total Duration:', this.totalFormattedDuration);
          },
          error: (err) => {
            console.error('Error calculating total video duration', err);
          }
        });
      }
      parseDuration(durationStr: string): number {
        const parts = durationStr.split(':').map(Number); // [hh, mm, ss]
        let seconds = 0;
        if (parts.length === 3) {
          seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
        } else if (parts.length === 2) {
          seconds = parts[0] * 60 + parts[1];
        }
        return seconds;
      }
      computeTotalDurationForCourse(courseId: number): void {
        this.urlService.getCourseSectionById(courseId).subscribe({
          next: (sections) => {
            const sectionIds = sections.map(section => section.sectionId);
            console.log(`Course ${courseId} => Sections:`, sectionIds);
            const videoFetches = sectionIds.map(sectionId =>
              this.urlService.getVideosBySectionId(sectionId).pipe(
                map((videos: VideoSummaryDto[]) =>
                  videos.reduce((sum, video) => sum + video.videoDuration, 0)
                )
              )
            );
            forkJoin(videoFetches).subscribe({
              next: (durations: number[]) => {
                const totalSeconds = durations.reduce((sum, d) => sum + d, 0);
                console.log(`Course ${courseId} total video seconds:`, totalSeconds);
                this.courseDurations[courseId] = totalSeconds;
                this.formattedDurations[courseId] = this.formatDuration(totalSeconds);
              },
              error: (err) => console.error('Error fetching videos', err),
            });
          },
          error: (err) => console.error('Error fetching sections', err),
        });
      }
      formatDuration(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h}h ${m}m ${s}s`;
      }
// formatDuration(seconds: number): string {
//   const hours = seconds / 3600;
//   return ${hours.toFixed(1)} hours;
// }
      goToCoursePreview(course: any) {
        const courseId = course.createCourseId ?? course.id;
        console.log('Navigating to Course ID:', courseId);
        this.router.navigate(['/course-preview', courseId]);
      }
      fetchSectionIds(courseId: number): void {
        this.urlService.getCourseSectionById(courseId).subscribe({
          next: (sections) => {
            this.sectionIds = sections.map(section => section.sectionId);
            this.fetchVideosForSections(); // 👈 fetch videos immediately after getting section IDs
          },
          error: (err) => {
            console.error('Error fetching section IDs', err);
          }
        });
      }
      toggleSidebar(): void {
        this.sidebarVisible = !this.sidebarVisible;
      }
      onFilterChange(filterType: FilterType, event: Event): void {
        const input = event.target as HTMLInputElement;
        const value: FilterValue =
          filterType === 'category' || filterType === 'subCategory'
            ? parseInt(input.value, 10)
            : input.value;
        const filterSet = this.selectedFilters[filterType];
        input.checked ? filterSet.add(value) : filterSet.delete(value);
        this.applyFilters();
      }
      toggleAll(filterType: FilterType): void {
        const allItems = this.getFilterItems(filterType).map(
          (item) => item.id ?? item
        );
        const filterSet = this.selectedFilters[filterType];
        if (filterSet.size === 0) {
          this.selectedFilters[filterType] = new Set(allItems);
        } else {
          this.selectedFilters[filterType].clear();
        }
        this.applyFilters();
      }
        isAllSelected(filterType: FilterType): boolean {
      return (
        this.selectedFilters[filterType].size ===
        this.getFilterItems(filterType).length
      );
      }
      private getFilterItems(filterType: FilterType): any[] {
        switch (filterType) {
          case 'category':
            return this.categories;
          case 'subCategory':
            return this.subcategories;
          case 'level':
            return this.levels;
          case 'duration':
            return this.durations;
          case 'skill':
            return this.skills;
          default:
            return [];
        }
      }
      toggleAllCourses(event: Event): void {
        const input = event.target as HTMLInputElement;
        this.showAllCourses = input.checked;
        this.applyFilters();
      }
      applyFilters(): void {
        this.currentPage = 1;
        const query = this.searchQuery.trim().toLowerCase();
        this.filteredCourses = this.courses.filter((course) => {
          const title = (course['courseTitle'] || course.name || '').toLowerCase();
          const category = (course.category?.name || '').toLowerCase();
          const subCategory = (course.subCategory?.name || '').toLowerCase();
          const level = (course.level || '').toLowerCase();
          const duration = (course.duration || '').toLowerCase();
          const skills = course.skillsYouGain || [];
          const matchesSearch =
            query === '' ||
            title.includes(query) ||
            category.includes(query) ||
            subCategory.includes(query) ||
            level.includes(query) ||
            duration.includes(query) ||
            skills.some((skill: string) =>
              (skill || '').toLowerCase().includes(query)
            );
          const matchesFilters =
            (this.selectedFilters.category.size === 0 ||
              this.selectedFilters.category.has(course.categoryId ?? -1)) &&
            (this.selectedFilters.subCategory.size === 0 ||
              this.selectedFilters.subCategory.has(course.subCategoryId ?? -1)) &&
            (this.selectedFilters.level.size === 0 ||
              this.selectedFilters.level.has(course.level ?? '')) &&
            (this.selectedFilters.duration.size === 0 ||
              this.selectedFilters.duration.has(course.duration ?? '')) &&
            (this.selectedFilters.skill.size === 0 ||
              [...this.selectedFilters.skill].some((skill) =>
                course.skillsYouGain?.includes(skill as string)
              ));
          return matchesSearch && matchesFilters;
        });
      }
      get filterGroups(): { key: FilterType; label: string; items: any[] }[] {
        return [
          { key: 'category', label: 'Categories', items: this.categories },
          { key: 'subCategory', label: 'Subcategories', items: this.subcategories },
          { key: 'level', label: 'Level', items: this.levels },
          { key: 'duration', label: 'Duration', items: this.durations },
          { key: 'skill', label: 'Skills', items: this.skills },
        ];
      }
      isChecked(filterType: FilterType, value: FilterValue): boolean {
        return this.selectedFilters[filterType].has(value);
      }
      getThumbnail(binaryData: any): string {
        return binaryData
          ? `data:image/jpeg;base64,${binaryData}`
          : 'assets/default-thumbnail.jpg';
      }
      enroll(course: Course): void {
        if (!this.userId) {
          this.toastr.warning('Please log in to enroll.');
          return;
        }
        const enrollment = {
          userId: this.userId,
          createCourseId: course.createCourseId ?? course.id,
          enrollmentDate: new Date(),
          isCompleted: false,
        };
        this.urlService.enrollInCourse(enrollment).subscribe({
          next: () => this.toastr.success('Enrollment successful!'),
          error: (err) => {
            if (err.status === 409) {
              this.toastr.info('You have already enrolled in this course.');
            } else {
              this.toastr.error('Failed to enroll. Please try again.');
              console.error(err);
            }
          },
        });
      }
      get totalPages(): number {
        return Math.ceil(this.filteredCourses.length / this.pageSize);
      }
      get paginatedCourses(): Course[] {
        const start = (this.currentPage - 1) * this.pageSize;
        return this.filteredCourses.slice(start, start + this.pageSize);
      }
      prevPage(): void {
        if (this.currentPage > 1) this.currentPage--;
      }
      nextPage(): void {
        if (this.currentPage < this.totalPages) this.currentPage++;
      }
      showModal(type: FilterType): void {
        this.modalType = type;
        switch (type) {
          case 'category':
            this.modalItems = this.categories.map((cat) => ({
              label: cat.name,
              value: cat.id,
            }));
            break;
          case 'subCategory':
            this.modalItems = this.subcategories.map((sub) => ({
              label: sub.name,
              value: sub.id,
            }));
            break;
          case 'level':
            this.modalItems = this.levels.map((level) => ({
              label: level,
              value: level,
            }));
            break;
          case 'duration':
            this.modalItems = this.durations.map((duration) => ({
              label: duration,
              value: duration,
            }));
            break;
          case 'skill':
            this.modalItems = this.skills.map((skill) => ({
              label: skill,
              value: skill,
            }));
            break;

        }
        this.modalSelections = new Set(...[this.selectedFilters[type]]);
        this.modalVisible = true;
      }
    
      toggleModalSelection(value: FilterValue, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        if (checkbox.checked) {
          this.modalSelections.add(value);
        } else {
          this.modalSelections.delete(value);
        }
      }
      applyModalSelection(): void {
        if (this.modalType) {
          this.selectedFilters[this.modalType] = new Set([...this.modalSelections]);
          this.applyFilters();
        }
        this.closeModal();
      }
      closeModal(): void {
        this.modalVisible = false;
        this.modalType = null;
        this.modalItems = [];
        this.modalSelections = new Set();
      }
      toggleWishlist(course: any) {
        course.isWishlisted = !course.isWishlisted;
        this.urlService
          .toggleWishlist({
            userId: Number(this.userId),
            createCourseId: course.createCourseId,
            courseWishlist: course.isWishlisted,
            courseVisited: course.courseVisited || false, // optional
          })
          .subscribe({
            next: () => console.log('Wishlist toggled'),
            error: (err) => console.error('Error toggling wishlist', err),
          });
      }
}