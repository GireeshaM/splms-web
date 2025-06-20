import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbars/navbar/navbar.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [NavbarComponent,ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './instructor-dashboard.component.html',
  styleUrl: './instructor-dashboard.component.css'
})
export class InstructorDashboardComponent {

  selectedRange: '1w' | '1m' | '6m' | '1y' = '1w';

  stats = {
    '1w': {
      totalCourses: 120,
      totalCoursesChange: 5.2,
      activeCourses: 85,
      activeCoursesChange: -2.4,
      studentsEnrolled: 2430,
      studentsEnrolledChange: 8.1
    },
    '1m': {
      totalCourses: 115,
      totalCoursesChange: 3.1,
      activeCourses: 90,
      activeCoursesChange: 1.5,
      studentsEnrolled: 2310,
      studentsEnrolledChange: 4.3
    },
    '6m': {
      totalCourses: 110,
      totalCoursesChange: -2.3,
      activeCourses: 78,
      activeCoursesChange: -4.0,
      studentsEnrolled: 2120,
      studentsEnrolledChange: 2.2
    },
    '1y': {
      totalCourses: 105,
      totalCoursesChange: -4.5,
      activeCourses: 74,
      activeCoursesChange: -6.8,
      studentsEnrolled: 1980,
      studentsEnrolledChange: -1.5
    }
  };

  // Optional: method to get class based on percent change
  getChangeClass(value: number): string {
    return value >= 0 ? 'text-success' : 'text-danger';
  }

  getBadgeClass(value: number): string {
    return value >= 0 ? 'bg-success' : 'bg-danger';
  }

  getArrowIcon(value: number): string {
    return value >= 0 ? 'bi-arrow-up-right' : 'bi-arrow-down-right';
  }

 cards = [
  {
    title: 'Create an Engaging Course',
    description:
      "Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level.",
    image:
      'https://cdn.prod.website-files.com/62f0b227e38c6d799afcd8ba/642a702f5fbce22072754ef6_5_Strategy_Engage_Online_Course_.webp',
    link: '/list-requirements'
  },
  {
    title: 'Get Started with Video',
    description:
      'Quality video lectures can set your course apart. Use our resources to learn the basics, including how to script, light, and record your videos.',
    image:
      'https://thumbs.dreamstime.com/b/young-blogger-vector-illustration-teen-girl-recording-video-her-blog-laptop-room-kid-vlog-concept-flat-cartoon-style-231199817.jpg',
    link: '/video-creation-guide'
  },
  {
    title: 'Build Your Audience',
    description:
      'Set your course up for success by building your audience with proven marketing strategies.',
    image:
      'https://www.shutterstock.com/shutterstock/videos/3522971867/thumb/5.jpg?ip=x480',
    link: '/audience'
  },
  {
    title: 'Join the New Instructor Challenge!',
    description:
      'Get exclusive tips and resources to help launch your first course faster. Earn rewards when you complete the challenge!',
    image:
      'https://media.istockphoto.com/id/1171911961/vector/female-teacher-with-books-and-chalkboard-concept-illustration-for-school-education.jpg?s=612x612&w=0&k=20&c=PF5bNlFhW9b9I-5aXwp03yYkuWjk9x_FuPK0YsRcesA=',
    link: '/quiz'
  }
];


}