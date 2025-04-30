import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

const routes: Routes = [{path:'',component:UserDashboardComponent},
  {path:'learning-paths',loadComponent:()=>import('./learning-paths/learning-paths.component').then(m=>m.LearningPathsComponent)},
  {path:'user-assignments',loadComponent:()=>import('./user-assignments/user-assignments.component').then(m=>m.UserAssignmentsComponent)},
  {path:'user-grades',loadComponent:()=>import('./user-grades/user-grades.component').then(m=>m.UserGradesComponent)},
  {path:'user-intrests',loadComponent:()=>import('./user-intrests/user-intrests.component').then(m=>m.UserIntrestsComponent)},
  {path:'user-profile',loadComponent:()=>import('./user-profile/user-profile.component').then(m=>m.UserProfileComponent)},
  {path:'user-settings',loadComponent:()=>import('./user-settings/user-settings.component').then(m=>m.UserSettingsComponent)},
  {path:'my-enrolled-courses',loadComponent:()=>import('./my-enrolled-courses/my-enrolled-courses.component').then(m=>m.MyEnrolledCoursesComponent)},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
