import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { LearningPathsComponent } from './learning-paths/learning-paths.component';
import { UserAssignmentsComponent } from './user-assignments/user-assignments.component';
import { UserGradesComponent } from './user-grades/user-grades.component';
import { UserIntrestsComponent } from './user-intrests/user-intrests.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MyEnrolledCoursesComponent } from './my-enrolled-courses/my-enrolled-courses.component';

const routes: Routes = [
  { path: 'user-dashboard', component: UserDashboardComponent },
  {
    path: 'learning-paths',
    component: LearningPathsComponent,
  },
  {
    path: 'user-assignments',
    component: UserAssignmentsComponent,
  },
  {
    path: 'user-grades',
    component: UserGradesComponent,
  },
  {
    path: 'user-interests',
    component: UserIntrestsComponent,
  },
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'user-settings',
    component: UserSettingsComponent,
  },
  {
    path: 'my-enrolled-courses',
    component: MyEnrolledCoursesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
