import { Component } from '@angular/core';
import { NavbarComponent } from "../../../../navbars/navbar/navbar.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-video-creation-guide',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './video-creation-guide.component.html',
  styleUrl: './video-creation-guide.component.css'
})
export class VideoCreationGuideComponent {
infographics = [
    {
      image: 'images/infographic1.jpg',
      title: 'Scripting Tips',
      description: 'Learn how to write engaging scripts for your videos.',
      details: 'Scripting is the backbone of any great video. Focus on clear, concise, and engaging content.'
    },
    {
      image: 'images/infographic2.jpg',
      title: 'Lighting Setup',
      description: 'Discover the best lighting techniques for professional videos.',
      details: 'Proper lighting can make or break your video. Use soft, diffused light for a professional look.'
    },
    {
      image: 'images/infographic3.jpg',
      title: 'Audio Quality',
      description: 'Choose the right microphone for crystal-clear audio.',
      details: 'Good audio is just as important as good video. Invest in a quality microphone for better results.'
    },
    {
      image: 'images/infographic4.jpg',
      title: 'Editing Techniques',
      description: 'Master basic editing techniques to enhance your videos.',
      details: 'Editing can transform raw footage into a polished final product. Use cuts, transitions, and effects wisely.'
    }
  ];

  // Method to handle "Learn More" button click
  showDetails(infographic: any) {
    alert('Details for ${infographic.title}:\n\n${infographic.details}');
  }
  // Variable to track which tip is hovered
  hoveredTip: string | null = null;

  // Handle hover over the tips to display more details
  toggleCard(tip: string) {
    this.hoveredTip = tip;
  }

  // Function to start learning (called when "Start Learning" button is clicked)
  startLearning() {
    // Implement navigation to the first tutorial or a relevant section
    console.log('Starting the learning process...');
    // For example, navigate to the first tutorial page or open a modal
  }

  // Function to handle quiz start (called when "Take the Engagement Quiz" button is clicked)
  startQuiz() {
    // Open quiz modal or navigate to quiz page
    console.log('Starting the quiz...');
    // Code to navigate to quiz or open modal
  }

  // Function to handle video submission for review (called when "Submit Your Video" button is clicked)
  submitVideoForReview() {
    // Implement submission logic or open a form/modal for instructors to submit their videos for review
    console.log('Video submitted for review...');
    // Example: Open a modal or call an API to submit the video
  }
}