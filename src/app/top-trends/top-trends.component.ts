import { Component, ElementRef, Renderer2 } from '@angular/core';
import { ModrenComponent } from '../modren/modren.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-top-trends',
  imports: [ModrenComponent,CommonModule,FormsModule,],
  templateUrl: './top-trends.component.html',
  styleUrl: './top-trends.component.scss'
})
export class TopTrendsComponent {
  activeTab: string = 'plan'; // Default tab is 'Plan your curriculum'
  cards = [
    {
      image: 'assets/images/rayarajesh.jpeg',
      quote: 'SLMS offers an intuitive platform for managing courses and roles. Its robust RBAC ensures secure access, though UI could improve. Ideal for educators and learners seeking simplicity and functionality!',
      author: 'John Doe'
    },
    {
      image: 'assets/images/ai2women.avif',
      quote: 'SLMS streamlines learning with effective role-based access and a solid database structure. It’s user-friendly for beginners, but advanced features and design polish could enhance the experience further.!',
      author: 'Jane Smith'
    },
    {
      image: 'assets/images/ai women.jpeg',
      quote: 'SLMS delivers a practical LMS with strong role management and easy setup. It’s great for basic needs, though it lacks some modern flair and could use more customization options.',
      author: 'Michael Lee'
    }
  ];
   // Array to generate 18 cards
  private isSplit = false; // Track the state of the cards
  currentIndex = 0;
  isSlideVisible = false;
  isTrendsSlideVisible: boolean = false;
  isExploreSlideVisible = false;
  isDemoSlideVisible: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const splitCard = this.el.nativeElement.querySelector('.split-card');

    if (splitCard) {
      // Use Intersection Observer to detect when the section is in view
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !this.isSplit) {
              // Add the animation class when the section is in view
              this.renderer.addClass(splitCard, 'animate');
              this.isSplit = true; // Mark the cards as split
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
      );

      observer.observe(splitCard);
    }

    // Automatically transition slides every 3 seconds
    setInterval(() => {
      this.nextSlide();
    }, 3000);

    this.animateCounters();
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  toggleCards(): void {
    const splitCard = this.el.nativeElement.querySelector('.split-card');
    if (splitCard) {
      if (this.isSplit) {
        // If cards are split, reset them
        this.renderer.removeClass(splitCard, 'animate');
        this.isSplit = false;
      } else {
        // If cards are reset, split them
        this.renderer.addClass(splitCard, 'animate');
        this.isSplit = true;
      }
    }
  }

  prevSlide() {
    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    const slides = Array.from(track.children) as HTMLElement[];
    this.currentIndex = (this.currentIndex - 1 + slides.length) % slides.length;
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  nextSlide() {
    const track = this.el.nativeElement.querySelector('.carousel-track') as HTMLElement;
    const slides = Array.from(track.children) as HTMLElement[];
    this.currentIndex = (this.currentIndex + 1) % slides.length;
    track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
  }

  showSlide() {
    this.isSlideVisible = true;
  }

  hideSlide() {
    this.isSlideVisible = false;
  }

  showTrendsSlide() {
    this.isTrendsSlideVisible = true;
  }

  hideTrendsSlide() {
    this.isTrendsSlideVisible = false;
  }

  showExploreSlide() {
    this.isExploreSlideVisible = true;
  }

  hideExploreSlide() {
    this.isExploreSlideVisible = false;
  }

  showDemoSlide() {
    this.isDemoSlideVisible = true;
  }

  hideDemoSlide() {
    this.isDemoSlideVisible = false;
  }

  private animateCounters(): void {
    const counters = document.querySelectorAll('.count');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target')!;
      const updateCount = () => {
        const current = +counter.textContent!;
        const increment = target / 200; // Adjust speed here
        if (current < target) {
          counter.textContent = `${Math.ceil(current + increment)}`;
          setTimeout(updateCount, 10);
        } else {
          counter.textContent = `${target}`;
        }
      };
      updateCount();
    });
  }
}