import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-modren',
  imports: [CommonModule],
  templateUrl: './modren.component.html',
  styleUrl: './modren.component.css',
})
export class ModrenComponent implements OnInit {
  showModal: boolean = false; // State to control modal visibility
  imageSrc: string | null = null; // State to hold the image source
  showTrainerPopup: boolean = false; // State to control Trainer popup visibility
  showUserPopup: boolean = false; // State to control User popup visibility
  popupMessage: string | null = null; // State to hold the popup message
  images: any;
  trainer: any;
  showTrainerSlide: boolean = false;
  showPopup: boolean = false;

  constructor() {}

  ngOnInit(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.applyParallaxEffect();
      this.highlightOnScroll();
    }
  }

  toggleModal(): void {
    this.showModal = !this.showModal;
  }

  closeModal(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (target.classList.contains('modal-overlay')) {
      this.showModal = false;
    }
  }

  showTrainerImage(): void {
    this.imageSrc = 'images/trainer.svg'; // Path for Trainer image
    this.popupMessage = 'Welcome Trainer!'; // Message for Trainer
    this.showTrainerPopup = true; // Show Trainer popup
  }

  showUserImage(): void {
    this.imageSrc = 'images/user.svg'; // Path for User image
    this.popupMessage = 'Welcome User!'; // Message for User
    this.showUserPopup = true; // Show User popup
  }

  closeTrainerPopup(): void {
    this.showTrainerPopup = false; // Hide Trainer popup
    this.popupMessage = null; // Clear the popup message
    this.imageSrc = null; // Clear the image source
  }

  closeUserPopup(): void {
    this.showUserPopup = false; // Hide User popup
    this.popupMessage = null; // Clear the popup message
    this.imageSrc = null; // Clear the image source
  }

  closeTrainerSlide(): void {
    this.showTrainerSlide = false; // Hide the trainer slide
  }

  closePopup(): void {
    this.showPopup = false; // Hide the popup
    this.popupMessage = null; // Clear the popup message
    this.imageSrc = null; // Clear the image source
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      this.applyParallaxEffect();
      this.highlightOnScroll();
    }
  }

  private applyParallaxEffect(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const elements = document.querySelectorAll('.parallax-text');
      elements.forEach((element) => {
        const speed = parseFloat(element.getAttribute('data-speed') || '1');
        const offset = window.scrollY * speed;
        (element as HTMLElement).style.transform = `translateY(${offset}px)`;
      });
    }
  }

  private highlightOnScroll(): void {
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      const cards = document.querySelectorAll('.business-card');
      const windowHeight = window.innerHeight;
  
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= windowHeight;
  
        if (isVisible) {
          card.classList.add('highlight');
        } else {
          card.classList.remove('highlight');
        }
      });
  
      const sections = document.querySelectorAll('.business-text');
  
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= windowHeight;
  
        if (isVisible) {
          section.classList.add('highlight');
          section.classList.remove('hidden');
        } else {
          section.classList.remove('highlight');
          section.classList.add('hidden');
        }
      });
  
      const items = document.querySelectorAll('.business-item');
      let highlighted = false;
  
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
  
        if (isVisible && !highlighted) {
          item.classList.add('highlight');
          highlighted = true; // Ensure only one item is highlighted at a time
        } else {
          item.classList.remove('highlight');
        }
      });
    }
  }
}
