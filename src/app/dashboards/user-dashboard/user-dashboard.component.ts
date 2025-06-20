import { Component } from '@angular/core';
import { NavbarComponent } from "../../navbars/navbar/navbar.component";
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dashboard',
  imports: [NavbarComponent,FormsModule,CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent {
 dynamicText = {
    title: 'Advance Your Career with Software Courses',
    description: 'Enroll in top-rated software courses and enhance your skills for a bright future in tech!'
  };

  courses = [
    {
      image: 'https://img.freepik.com/free-vector/programming-concept-illustration_114360-1351.jpg',
      title: 'Full Stack Web Development',
      description: 'Learn to build complete web applications with front-end and back-end technologies.',
      link: '/courses/fullstack'
    },
    {
      image: 'https://img.freepik.com/free-vector/data-science-concept-illustration_114360-1196.jpg',
      title: 'Data Science & AI',
      description: 'Master data analysis, machine learning, and AI technologies for real-world applications.',
      link: '/courses/datascience'
    },
    {
      image: 'https://img.freepik.com/free-vector/cyber-security-illustration-concept_114360-797.jpg',
      title: 'Cyber Security & Ethical Hacking',
      description: 'Understand cybersecurity fundamentals and ethical hacking techniques.',
      link: '/courses/cybersecurity'
    },
    {
      image: 'https://img.freepik.com/free-vector/mobile-app-development-concept_23-2148681230.jpg',
      title: 'Mobile App Development',
      description: 'Develop Android and iOS applications using Flutter and React Native.',
      link: '/courses/mobileapp'
    }
  ];

  selectedCourse: string | null = null;
  termsAccepted = false;

  constructor(private router: Router) {}

  openTermsAndConditions(courseLink: string) {
    this.selectedCourse = courseLink;
    this.termsAccepted = false;
    document.getElementById("termsModal")!.style.display = "flex";
  }

  closeModal() {
    document.getElementById("termsModal")!.style.display = "none";
  }

  acceptTerms() {
    if (this.termsAccepted && this.selectedCourse) {
      this.router.navigate([this.selectedCourse]);
      this.closeModal();
    }
  }

  onSlide(event: any) {
    const slideIndex = event.to;
    switch (slideIndex) {
      case 0:
        this.dynamicText = {
          title: 'Save on learning that fits your life',
          description: 'Get courses from ₹499 and create a self-paced learning lifestyle that works for you. Sale ends tomorrow.'
        };
        break;
      case 1:
        this.dynamicText = {
          title: 'All the skills you need in one place',
          description: 'From critical skills to technical topics, Udemy supports your professional development.'
        };
        break;
      case 2:
        this.dynamicText = {
          title: 'Learn from the best',
          description: 'Our courses are taught by industry experts who are passionate about teaching.'
        };
        break;
    }
  } 
}