import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard'; // ✅ Make sure this exists
import { RoleProfileComponent } from './role-profile/role-profile.component';
import { ListRequirementsComponent } from './core/instructor-module/create-new-course/list-requirements/list-requirements.component';
import { VideoCreationGuideComponent } from './core/instructor-module/create-new-course/video-creation-guide/video-creation-guide.component';
import { HomereviewsComponent } from './home/homereviews/homereviews.component';
import { TopTrendsComponent } from './home/top-trends/top-trends.component';
import { CoursePreviewComponent } from './core/instructor-module/course-content/course-preview/course-preview.component';
import { InstructorCourseComponent } from './core/instructor-module/course-content/instructor-course/instructor-course.component';
import { CreateCourseComponent } from './core/instructor-module/create-new-course/create-course/create-course.component';
import { CourseDisplayPreviewComponent } from './core/instructor-module/course-content/course-display-preview/course-display-preview.component';
import { AddSectionComponent } from './sections/add-section/add-section.component';
import { HomeDashboardComponent } from './home/home-dashboard/home-dashboard.component';

export const routes: Routes = [
  // Public routes
  {path:'',component:HomeDashboardComponent},
  // { path: '', component: HomepageDashboardComponent },
  {
    path: 'roles',
    loadComponent: () =>
      import('./Basic/roles/roles.component').then((x) => x.RolesComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./Basic/categories/categories.component').then(
        (x) => x.CategoriesComponent
      ),
  },
  {
    path: 'sub-categories',
    loadComponent: () =>
      import('./Basic/sub-categories/sub-categories.component').then(
        (x) => x.SubCategoriesComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./home/register/register.component').then(
        (x) => x.RegisterComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./home/login/login.component').then((x) => x.LoginComponent),
  },
  {
    path: 'nav-bar',
    loadComponent: () =>
      import('./navbars/navbar/navbar.component').then(
        (x) => x.NavbarComponent
      ),
  },
  {
    path: 'menu-management',
    loadComponent: () =>
      import('./Basic/menu-management/menu-management.component').then(
        (x) => x.MenuManagementComponent
      ),
  },

  {
    path: 'add-section',
    loadComponent: () =>
      import('./sections/add-section/add-section.component').then(
        (x) => x.AddSectionComponent
      ),
  },

  //users
  { path:'explore-courses',
    loadComponent: () =>
      import('./core/user-module/explore-courses/explore-courses.component').then(
        (x) => x.ExploreCoursesComponent
      ),
  },
  {
    path: 'my-courses',
    loadComponent: () =>
      import('./core/user-module/my-courses/my-courses.component').then(
        (x) => x.MyCoursesComponent
      ),
  },
  {
    path: 'my-certificates',
    loadComponent: () =>
      import(
        './core/user-module/my-certificates/my-certificates.component'
      ).then((x) => x.MyCertificatesComponent),
  },
  {
    path: 'learning-paths',
    loadComponent: () =>
      import('./core/user-module/learning-paths/learning-paths.component').then(
        (x) => x.LearningPathsComponent
      ),
  },
  {
    path: 'learning-points',
    loadComponent: () =>
      import(
        './core/user-module/learning-points/learning-points.component'
      ).then((x) => x.LearningPointsComponent),
  },
  {
    path: 'my-assignments',
    loadComponent: () =>
      import('./core/user-module/my-assignments/my-assignments.component').then(
        (x) => x.MyAssignmentsComponent
      ),
  },
  {
    path: 'live-training',
    loadComponent: () =>
      import('./core/user-module/live-training/live-training.component').then(
        (x) => x.LiveTrainingComponent
      ),
  },

  {path:'course-display/:id',
    loadComponent:()=>
      import(
        './core/user-module/user-course-display/user-course-display.component').then((x) => x.UserCourseDisplayComponent)
  },

  //instructor
  {
    path: 'define-learnings',
    loadComponent: () =>
      import(
        './core/instructor-module/create-new-course/define-learnings/define-learnings.component'
      ).then((x) => x.DefineLearningsComponent),
  },
  {
    path: 'create-course',
    loadComponent: () =>
      import(
        './core/instructor-module/create-new-course/create-course/create-course.component'
      ).then((x) => x.CreateCourseComponent),
  },
  {
    path: 'course-preview/:id',
    component: CoursePreviewComponent,
  },
  {
    path: 'instructor-courses',
    component: InstructorCourseComponent,
  },
  { path: 'editcourse/:id', component: CreateCourseComponent },
  {
    path: 'course-display-preview/:id',
    component: CourseDisplayPreviewComponent,
  },
  { path:'add-sections/:id',component:AddSectionComponent},
  {
    path: 'course-display-preview',
    loadComponent: () =>
      import(
        './core/instructor-module/course-content/course-display-preview/course-display-preview.component'
      ).then((x) => x.CourseDisplayPreviewComponent),
  },
  {
    path: 'course-reviews',
    loadComponent: () =>
      import(
        './core/instructor-module/Interactions/course-reviews/course-reviews.component'
      ).then((x) => x.CourseReviewsComponent),
  },
  {
    path: 'my-reviews',
    loadComponent: () =>
      import(
        './core/instructor-module/Interactions/my-reviews/my-reviews.component'
      ).then((x) => x.MyReviewsComponent),
  },
  {
    path: 'add-faqs',
    loadComponent: () =>
      import(
        './core/instructor-module/User-Engagement/add-faqs/add-faqs.component'
      ).then((x) => x.AddFaqsComponent),
  },
  {
    path: 'final-assessment',
    loadComponent: () =>
      import(
        './core/instructor-module/User-Engagement/add-final-assessment/add-final-assessment.component'
      ).then((x) => x.AddFinalAssessmentComponent),
  },

  {
    path: 'course-reviews',
    loadComponent: () =>
      import(
        './core/admin-module/courses-module/course-reviews/course-reviews.component'
      ).then((x) => x.CourseReviewsComponent),
  },
  {
    path: 'manage-courses',
    loadComponent: () =>
      import(
        './core/admin-module/courses-module/manage-courses/manage-courses.component'
      ).then((x) => x.ManageCoursesComponent),
  },
  {
    path: 'trending-courses',
    loadComponent: () =>
      import(
        './core/admin-module/courses-module/trending-courses/trending-courses.component'
      ).then((x) => x.TrendingCoursesComponent),
  },
  {
    path: 'instructor-profiles',
    loadComponent: () =>
      import(
        './core/admin-module/Instructors-module/instructor-profiles/instructor-profiles.component'
      ).then((x) => x.InstructorProfilesComponent),
  },
  {
    path: 'instructor-reviews',
    loadComponent: () =>
      import(
        './core/admin-module/Instructors-module/instructor-reviews/instructor-reviews.component'
      ).then((x) => x.InstructorReviewsComponent),
  },
  {
    path: 'upload-course',
    loadComponent: () =>
      import(
        './core/admin-module/Instructors-module/upload-courses/upload-courses.component'
      ).then((x) => x.UploadCoursesComponent),
  },
  {
    path: 'user-interest',
    loadComponent: () =>
      import(
        './core/admin-module/users-module/users-intrest/users-intrest.component'
      ).then((x) => x.UsersIntrestComponent),
  },
  {
    path: 'user-feedbacks',
    loadComponent: () =>
      import(
        './core/admin-module/users-module/users-reviews/users-reviews.component'
      ).then((x) => x.UsersReviewsComponent),
  },
  {
    path: 'user-trends',
    loadComponent: () =>
      import(
        './core/admin-module/users-module/users-trends/users-trends.component'
      ).then((x) => x.UsersTrendsComponent),
  },
  { path: 'list-requirements', component: ListRequirementsComponent },
  { path: 'video-creation-guide', component: VideoCreationGuideComponent },
  { path: 'home-reviews', component: HomereviewsComponent },
  { path: 'top-trends', component: TopTrendsComponent },

  { path: 'profile/:role/:id', component: RoleProfileComponent },

  // Role-based dashboard routes
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./dashboards/admin-dashboard/admin-dashboard.component').then(
        (x) => x.AdminDashboardComponent
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'admin' },
  },
  {
    path: 'user-dashboard',
    loadComponent: () =>
      import('./dashboards/user-dashboard/user-dashboard.component').then(
        (x) => x.UserDashboardComponent
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'user' },
  },
  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import(
        './dashboards/instructor-dashboard/instructor-dashboard.component'
      ).then((x) => x.InstructorDashboardComponent),
    canActivate: [RoleGuard],
    data: { expectedRole: 'instructor' },
  },
  {
    path: 'hr-dashboard',
    loadComponent: () =>
      import('./dashboards/hr-dashboard/hr-dashboard.component').then(
        (x) => x.HrDashboardComponent
      ),
    canActivate: [RoleGuard],
    data: { expectedRole: 'hr' },
  },

  // Unauthorized & fallback
  {
    path: 'unauthorized',
    loadComponent: () =>
      import('./shared/unauthorized/unauthorized.component').then(
        (x) => x.UnauthorizedComponent
      ),
  },
  { path: '**', redirectTo: '' },


];
