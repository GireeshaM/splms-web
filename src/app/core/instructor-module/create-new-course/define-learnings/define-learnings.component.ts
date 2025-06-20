import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../navbars/navbar/navbar.component";

@Component({
  selector: 'app-define-learnings',
  imports: [NavbarComponent],
  templateUrl: './define-learnings.component.html',
  styleUrl: './define-learnings.component.css'
})
export class DefineLearningsComponent {

  cards = [
    {
      title: 'Create an Engaging Course',
      description:
        "Whether you've been teaching for years or are teaching for the first time, you can make an engaging course. We've compiled resources and best practices to help you get to the next level, no matter where you're starting.",
      image: '/course-creation.png',
      link: '#'
    },
    {
      title: 'Get Started with Video',
      description:
        'Quality video lectures can set your course apart. Use our resources to learn the basics.',
      image: '/video-creation.png',
      link: '#'
    },
    {
      title: 'Build Your Audience',
      description:
        'Set your course up for success by building your audience.',
      image: '/audience-building.png',
      link: '#'
    },
    {
      title: 'Join the New Instructor Challenge!',
      description:
        'Get exclusive tips and resources designed to help you launch your first course faster! Eligible instructors who publish their first course on time will receive a special bonus to celebrate. Start today!',
      image: '/instructor-challenge.png',
      link: '#'
    }
  ];

}
