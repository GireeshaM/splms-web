import { Component, Input } from '@angular/core';
import { Course } from '../../instructor-models';

@Component({
  selector: 'app-instructor-course-card',
  imports: [],
  templateUrl: './instructor-course-card.component.html',
  styleUrl: './instructor-course-card.component.css'
})
export class InstructorCourseCardComponent {
 @Input() course!: Course;
}
