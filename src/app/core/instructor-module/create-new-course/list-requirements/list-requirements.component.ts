import { Component, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { NavbarComponent } from "../../../../navbars/navbar/navbar.component";

@Component({
  selector: 'app-list-requirements',
  imports: [MatIcon, NavbarComponent],
  templateUrl: './list-requirements.component.html',
  styleUrl: './list-requirements.component.css'
})
export class ListRequirementsComponent implements OnInit {
  instructor = {
    name: 'Avinash',
    courses: [] // Placeholder for courses (if needed)
  };

  // Example step data (for demonstration)
  steps = [
    {
      title: 'Define Your Course',
      icon: 'description',
      description: 'Start by defining the title, description, and learning objectives of your course.',
      tips: [
        'Use clear and concise language.',
        'Focus on the skills professionals will gain.'
      ],
      link: '#'
    },
    {
      title: 'Add Course Content',
      icon: 'video_library',
      description: 'Upload your course materials, including videos, presentations, PDFs, and quizzes.',
      tips: [
        'Use high-quality videos.',
        'Include downloadable resources.'
      ],
      link: '#'
    },
    {
      
        "title": "Set Learning Goals and Outcomes",
        "icon": "school",
        "description": "Define the key objectives and expected outcomes for your course.",
        "tips": [
          "Break down goals into measurable milestones.",
          "Align outcomes with learner expectations and industry standards."
        ],
      
      link: '#'
      },
    {
      title: 'Publish and Promote',
      icon: 'publish',
      description: 'Publish your course and promote it to your audience using AI-driven tools.',
      tips: [
        'Share on LinkedIn and other professional networks.',
        'Use email marketing to reach your audience.'
      ],
      link: '#'
    }
  ];

  // Example visuals data (for demonstration)
  visuals = [
    {
      image: 'https://cdn.dribbble.com/userupload/16462258/file/original-6c6bfe2dd9d928382a8a89e0afcb78df.jpg?format=webp&resize=400x300&vertical=centers',
      description: 'Add a professional logo to represent your course.'
    },
    {
      image: 'images/course-banner.jpg',
      description: 'Use a banner image to make your course stand out.'
    },
    {
      image: 'images/course-thumbnail.png',
      description: 'Create an eye-catching thumbnail for your course.'
    }
  ];

  // Course creation form data
  newCourse = {
    title: '',
    description: ''
  };

  // Flag to show/hide the course creation form
  showCourseForm = false;

  constructor() {}

  ngOnInit(): void {
    // Fetch instructor data or initialize any required data here
  }

  // Open the course creation form
  openCourseCreationForm(): void {
    this.showCourseForm = true;
  }
  createCourse(): void {
    console.log('Course creation started!');
    // Add your course creation logic here
  }

  // Handle form submission
 
}