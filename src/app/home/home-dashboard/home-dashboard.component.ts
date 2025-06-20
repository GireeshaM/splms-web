import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { CommonModule } from '@angular/common';
import { TopTrendsComponent } from '../top-trends/top-trends.component';
import { HomereviewsComponent } from '../homereviews/homereviews.component';
import { HomeNavbarComponent } from '../../navbars/home-navbar/home-navbar.component';
import { MainpageComponent } from "../mainpage/mainpage.component";

@Component({
  selector: 'app-home-dashboard',
  imports: [CommonModule, TopTrendsComponent, HomereviewsComponent, HomeNavbarComponent, MainpageComponent],
  templateUrl: './home-dashboard.component.html',
  styleUrl: './home-dashboard.component.css'
})
export class HomeDashboardComponent implements AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  constructor(private router: Router,private dialog: MatDialog) {}

  closeLoginModal() {
    document.getElementById("loginModal")!.style.display = "none";
  }

  dynamicText = {
    title: 'Advance Your Career with Software Courses',
    description: 'Enroll in top-rated software courses and enhance your skills for a bright future in tech!'
  };

  onLoginSubmit(event: Event) {
    event.preventDefault(); // Prevent the default form submission behavior
    console.log('Login form submitted');
    // Add your login logic here
  }

  onSlide(event: any) {
    const slideIndex = event.to;
    const videos = document.querySelectorAll('.carousel-item video');

    // Pause all videos
    videos.forEach((video) => (video as HTMLVideoElement).pause());

    // Play the video in the active slide safely
    const activeVideo = videos[slideIndex] as HTMLVideoElement;
    if (activeVideo) {
      activeVideo.play().catch(() => {
        console.warn('Autoplay blocked, waiting for user interaction.');

        const playOnInteraction = () => {
          activeVideo.play().catch((error) => {
            console.error('Video still failed to play after interaction:', error);
          });

          window.removeEventListener('click', playOnInteraction);
          window.removeEventListener('keydown', playOnInteraction);
          window.removeEventListener('touchstart', playOnInteraction);
        };

        window.addEventListener('click', playOnInteraction);
        window.addEventListener('keydown', playOnInteraction);
        window.addEventListener('touchstart', playOnInteraction);
      });
    }

    // Update dynamic text
    switch (slideIndex) {
      case 0:
        this.dynamicText = {
          title: 'Unlocking the Future of Learning with AI',
          description: 'AI-powered SPRINTPARK LEARNING MANAGEMENT SYSTEM (SLMS) are transforming education by personalizing learning, providing real-time feedback, and automating tasks.'
        };
        break;
      case 1:
        this.dynamicText = {
          title: 'The Importance of Certification.',
          description: 'Certification enhances your skills, increases job opportunities, and boosts credibility. It can lead to higher earnings, greater job security.'
        };
        break;
      case 2:
        this.dynamicText = {
          title: 'Personalized learning with technology',
          description: 'Personalized learning with technology adapts education to each candidate needs and pace. AI and learning platforms help track progress and provide tailored content.'
        };
        break;
    }
  }

  ngAfterViewInit() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const activeVideo = document.querySelector('.carousel-item.active video') as HTMLVideoElement;
      if (activeVideo) {
        activeVideo.play().catch((error) => {
          console.warn('Video autoplay failed, trying after user interaction.', error);
    
          const playOnUserInteraction = () => {
            activeVideo.play().catch(err => console.error('Still failed after interaction:', err));
            window.removeEventListener('click', playOnUserInteraction);
            window.removeEventListener('keydown', playOnUserInteraction);
            window.removeEventListener('touchstart', playOnUserInteraction);
          };
    
          window.addEventListener('click', playOnUserInteraction);
          window.addEventListener('keydown', playOnUserInteraction);
          window.addEventListener('touchstart', playOnUserInteraction);
        });
      }
    
      const videos = document.querySelectorAll('.carousel-item video');
    
      videos.forEach((video, index) => {
        video.addEventListener('ended', () => {
          const nextButton = this.carousel.nativeElement.querySelector('.carousel-control-next');
          const isLastVideo = index === videos.length - 1;
    
          if (isLastVideo) {
            const firstButton = this.carousel.nativeElement.querySelector('.carousel-indicators button[data-bs-slide-to="0"]');
            if (firstButton) {
              firstButton.click();
            }
          } else if (nextButton) {
            nextButton.click();
          }
        });
      });
    }
  }
  

  onSearch(): void {
    console.log('Search button clicked');
    // Add your search logic here
  }

  openLoginModal() {
    this.dialog.open(LoginComponent, {
      width: '400px', // optional size
      disableClose: false,
      backdropClass: 'custom-backdrop' // optional, for custom styling
    });
  }

  openRegistionModel(){
    this.dialog.open(RegisterComponent,{
      width:'1000px', 
      disableClose:false,
      backdropClass:'custom-backdrop'
    });
  }

}
