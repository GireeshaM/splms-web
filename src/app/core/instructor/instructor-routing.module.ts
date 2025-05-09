import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstructorDashboardComponent } from './instructor-dashboard/instructor-dashboard.component';
import { InstructorProfileComponent } from './instructor-profile/instructor-profile.component';
import { LearningPathsComponent } from './learning-paths/learning-paths.component';
import { CreateCourseComponent } from './create-course/create-course.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { DefineCourseLearningsComponent } from './define-course-learnings/define-course-learnings.component';
import { ListRequirementsComponent } from './list-requirements/list-requirements.component';
import { MyCoursesComponent } from './my-courses/my-courses.component';
import { ViewAssignmentFeedbackComponent } from './view-assignment-feedback/view-assignment-feedback.component';
import { ViewUserFeedbackComponent } from './view-user-feedback/view-user-feedback.component';

const routes: Routes = [
  { path: 'instructor-dashboard', component: InstructorDashboardComponent },
  {
    path: 'instructor/instructor-profile',
    component: InstructorProfileComponent,
  },
  {
    path: 'instructor/learning-paths',
    component: LearningPathsComponent,
  },
  {
    path: 'instructor/create-course',
    component: CreateCourseComponent,
  },
  {
    path: 'instructor/user-feedback',
    component: UserFeedbackComponent,
  },
  {
    path: 'instructor/define-course-learnings',
    component: DefineCourseLearningsComponent,
  },
  {
    path: 'instructor/list-requirements',
    component: ListRequirementsComponent,
  },
  {
    path: 'instructor/my-courses',
    component: MyCoursesComponent,
  },
  {
    path: 'instructor/view-assignment-feedback',
    component: ViewAssignmentFeedbackComponent,
  },
  {
    path: 'instructor/view-user-feedback',
    component: ViewUserFeedbackComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InstructorRoutingModule {}
