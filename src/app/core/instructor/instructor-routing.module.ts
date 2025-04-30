import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';

const routes: Routes = [{path:'',component:InstructorDashboardComponent},
  {path:'instructor/instructor-profile',loadComponent: () => import('./instructor-profile/instructor-profile.component').then(m => m.InstructorProfileComponent)},
{path:'instructor/instructor-settings', loadComponent: () => import('./instructor-settings/instructor-settings.component').then(m => m.InstructorSettingsComponent)},
{path:'instructor/learning-paths', loadComponent: () => import('./learning-paths/learning-paths.component').then(m => m.LearningPathsComponent)},
{path:'instructor/create-course', loadComponent: () => import('./create-course/create-course.component').then(m => m.CreateCourseComponent)},
{path:'instructor/user-feedback', loadComponent: () => import('./user-feedback/user-feedback.component').then(m => m.UserFeedbackComponent)},
{path:'instructor/define-course-learnings', loadComponent: () => import('./define-course-learnings/define-course-learnings.component').then(m => m.DefineCourseLearningsComponent)},
{path:'instructor/list-requirements', loadComponent: () => import('./list-requirements/list-requirements.component').then(m => m.ListRequirementsComponent)},
{path:'instructor/my-courses', loadComponent: () => import('./my-courses/my-courses.component').then(m => m.MyCoursesComponent)},
{path:'instructor/view-assignment-feedback', loadComponent: () => import('./view-assignment-feedback/view-assignment-feedback.component').then(m => m.ViewAssignmentFeedbackComponent)},
{path:'instructor/view-user-feedback', loadComponent: () => import('./view-user-feedback/view-user-feedback.component').then(m => m.ViewUserFeedbackComponent)},
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
