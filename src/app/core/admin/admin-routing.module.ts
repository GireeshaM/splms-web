import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

const routes: Routes = [{path:'',component:AdminDashboardComponent},
  {path:'admin/admin-profile',loadComponent: () => import('./admin-profile/admin-profile.component').then(m => m.AdminProfileComponent)},
  {path:'admin/see-instructor-profile',loadComponent: () => import('./see-instructor-profile/see-instructor-profile.component').then(m => m.SeeInstructorProfileComponent)},
  {path:'admin/see-user-reviews',loadComponent: () => import('./see-user-reviews/see-user-reviews.component').then(m => m.SeeUserReviewsComponent)},
  {path:'admin/see-user-insights',loadComponent: () => import('./see-user-insights/see-user-insights.component').then(m => m.SeeUserInsightsComponent)},
  {path:'admin/view-all-courses',loadComponent: () => import('./view-all-courses/view-all-courses.component').then(m => m.ViewAllCoursesComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
