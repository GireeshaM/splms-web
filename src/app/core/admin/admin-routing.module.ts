import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminProfileComponent } from './admin-profile/admin-profile.component';
import { SeeInstructorProfileComponent } from './see-instructor-profile/see-instructor-profile.component';
import { SeeUserReviewsComponent } from './see-user-reviews/see-user-reviews.component';
import { SeeUserInsightsComponent } from './see-user-insights/see-user-insights.component';
import { ViewAllCoursesComponent } from './view-all-courses/view-all-courses.component';

const routes: Routes = [
  { path: 'admin-dashboard', component: AdminDashboardComponent },
  {
    path: 'admin/admin-profile',
    component: AdminProfileComponent,
  },
  {
    path: 'admin/see-instructor-profile',
    component: SeeInstructorProfileComponent,
  },
  {
    path: 'admin/see-user-reviews',
    component: SeeUserReviewsComponent,
  },
  {
    path: 'admin/see-user-insights',
    component: SeeUserInsightsComponent,
  },
  {
    path: 'admin/view-all-courses',
    component: ViewAllCoursesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
