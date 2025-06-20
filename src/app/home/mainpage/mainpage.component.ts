import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mainpage',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './mainpage.component.html',
  styleUrl: './mainpage.component.css'
})
export class MainpageComponent implements AfterViewInit , OnInit {

  ngOnInit() {
  console.log('Active category on init:', this.activeCategory);
}

  stats = [
    { icon: 'images/1.svg', value: 5000, label: 'Total Achievements', suffix: '+', currentValue: 0 },
    { icon: 'images/2.svg', value: 200, label: 'Total Users', suffix: '+', currentValue: 0 },
    { icon: 'images/3.svg', value: 80, label: 'Total Instructors', suffix: '+', currentValue: 0 },
    { icon: 'images/4.svg', value: 2000, label: 'Total Courses', suffix: '+', currentValue: 0 },
  ];

  @ViewChildren('statBlock', { read: ElementRef }) statBlocks!: QueryList<ElementRef>;

  ngAfterViewInit() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const index = Number((entry.target as HTMLElement).getAttribute('data-index'));
        if (entry.isIntersecting) {
          this.animateCount(index);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    this.statBlocks.forEach((element, index) => {
      element.nativeElement.setAttribute('data-index', index.toString());
      observer.observe(element.nativeElement);
    });
  }

  animateCount(index: number) {
    const target = this.stats[index].value;
    const duration = 3000;
    const frameRate = 30;
    const steps = Math.ceil(duration / (1000 / frameRate));
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      this.stats[index].currentValue = Math.floor(progress * target);

      if (currentStep >= steps) {
        this.stats[index].currentValue = target;
        clearInterval(interval);
      }
    }, 1000 / frameRate);
  }

  showConsultationModal = false;

  openConsultationModal(event: Event) {
    event.preventDefault();
    this.showConsultationModal = true;
  }

  closeConsultationModal() {
    this.showConsultationModal = false;
  }

  categories: string[] = [
  'Courses',
  'Programming',
  'Data Science',
  'Design',
  'Marketing',
  'Soft Skills',
  'Business',
  'Languages'
];

// Active Tab
activeCategory = 'Courses';

// Method to change tab
setActiveCategory(category: string) {
  this.activeCategory = category;
}

// Cards
designCards = [
  {
    category: 'Courses',
    title: 'Build your foundation in coding with interactive exercises and real-world projects.',
    image: 'images/c1.svg',
  },
  {
    category: 'Courses',
    title: 'Learn data cleaning, analysis, and visualization using hands-on datasets.',
    image: 'images/c2.svg',
  },
  {
    category: 'Courses',
    title: 'Explore user-centered design principles with modern tools and case studies.',
    image: 'images/c3.svg',
  },
  {
    category: 'Courses',
    title: 'Understand SEO, content marketing, and campaign analytics from the ground up.',
    image: 'images/c4.svg',
  },
  {
    category: 'Courses',
    title: 'Develop confidence and clarity with practical speaking exercises and feedback.',
    image: 'images/c5.svg',
  },
  {
    category: 'Courses',
    title: 'Master narrative structures, tone, and creativity through guided writing prompts.',
    image: 'images/c6.svg',
  },
  {
    category: 'Courses',
    title: 'Learn business planning, management and finance skills with step-by-step lessons.',
    image: 'images/c7.svg',
  },

   // Programming
  {
    category: 'Programming',
    title: 'Advance your programming skills with JavaScript and Python.',
    image: 'https://img-c.udemycdn.com/course/750x422/4359810_9463.jpg',
  },
  {
    category: 'Programming',
    title: 'Master data structures and algorithms effectively.',
    image: 'https://www.classcentral.com/report/wp-content/uploads/2022/04/algorithms-and-data-structures-banner.png',
  },
  {
    category: 'Programming',
    title: 'Learn backend development using Node.js.',
    image: 'https://media.geeksforgeeks.org/wp-content/cdn-uploads/20220517005132/Why-to-Use-NodeJS-for-Backend-Development.jpg',
  },
  {
    category: 'Programming',
    title: 'Build mobile apps with Flutter and Dart.',
    image: 'https://media.licdn.com/dms/image/v2/D5612AQGIAV8sV52O6w/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1706116269844?e=2147483647&v=beta&t=cXMHxnCHHotZLWLjEr4ZYzQf6TKWcT2wj8nyaJPpGvY',
  },
  {
    category: 'Programming',
    title: 'Understand version control with Git and GitHub.',
    image: 'https://github.blog/wp-content/uploads/2024/05/GitHub-for-beginners.png',
  },

  // Data Science
  {
    category: 'Data Science',
    title: 'Learn data cleaning and preprocessing.',
    image: 'https://daxg39y63pxwu.cloudfront.net/images/blog/data-preprocessing-techniques-and-steps/data_preprocessing.webp',
  },
  {
    category: 'Data Science',
    title: 'Visualize data with Python and Matplotlib.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdE4AZnM_GeeAOYduyrlkbOXrGZRx1H0UdtA&s',
  },
  {
    category: 'Data Science',
    title: 'Master machine learning algorithms.',
    image: 'https://media.geeksforgeeks.org/wp-content/uploads/20230808130011/Machine-Learning-Algorithms1-(1).webp',
  },
  {
    category: 'Data Science',
    title: 'Analyze data using pandas and NumPy.',
    image: 'https://media.licdn.com/dms/image/v2/D4D12AQFVL5Ga2ZOf6Q/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1684066316062?e=2147483647&v=beta&t=vn78ZcCEh3c0aqo9avo_Hv6MNf1zpn9yUkfkbHTxM74',
  },
  {
    category: 'Data Science',
    title: 'Apply statistics in real-world datasets.',
    image: 'https://blogassets.leverageedu.com/blog/wp-content/uploads/2019/10/23165504/MSc-Statistics.png',
  },

  // Design
  {
    category: 'Design',
    title: 'Design stunning UI with Figma.',
    image: 'https://source.unsplash.com/featured/?uiux',
  },
  {
    category: 'Design',
    title: 'Create engaging mobile app interfaces.',
    image: 'https://source.unsplash.com/featured/?mobileappdesign',
  },
  {
    category: 'Design',
    title: 'Build wireframes and prototypes.',
    image: 'https://source.unsplash.com/featured/?wireframe',
  },
  {
    category: 'Design',
    title: 'Understand typography and color theory.',
    image: 'https://source.unsplash.com/featured/?typography',
  },
  {
    category: 'Design',
    title: 'Work with Adobe Illustrator and Photoshop.',
    image: 'https://source.unsplash.com/featured/?adobe',
  },

  // Marketing
  {
    category: 'Marketing',
    title: 'SEO fundamentals for better reach.',
    image: 'https://source.unsplash.com/featured/?seo',
  },
  {
    category: 'Marketing',
    title: 'Build your brand on social media.',
    image: 'https://source.unsplash.com/featured/?socialmedia',
  },
  {
    category: 'Marketing',
    title: 'Plan and run successful ad campaigns.',
    image: 'https://source.unsplash.com/featured/?marketing',
  },
  {
    category: 'Marketing',
    title: 'Email marketing strategies that convert.',
    image: 'https://source.unsplash.com/featured/?emailmarketing',
  },
  {
    category: 'Marketing',
    title: 'Use Google Analytics to track performance.',
    image: 'https://source.unsplash.com/featured/?googleanalytics',
  },

  // Soft Skills
  {
    category: 'Soft Skills',
    title: 'Develop excellent communication skills.',
    image: 'https://source.unsplash.com/featured/?communication',
  },
  {
    category: 'Soft Skills',
    title: 'Learn how to lead and inspire teams.',
    image: 'https://source.unsplash.com/featured/?leadership',
  },
  {
    category: 'Soft Skills',
    title: 'Time management techniques for productivity.',
    image: 'https://source.unsplash.com/featured/?productivity',
  },
  {
    category: 'Soft Skills',
    title: 'Conflict resolution and negotiation skills.',
    image: 'https://source.unsplash.com/featured/?negotiation',
  },
  {
    category: 'Soft Skills',
    title: 'Build emotional intelligence at work.',
    image: 'https://source.unsplash.com/featured/?emotionalintelligence',
  },

  // Business
  {
    category: 'Business',
    title: 'Basics of entrepreneurship and startups.',
    image: 'https://source.unsplash.com/featured/?startup',
  },
  {
    category: 'Business',
    title: 'Learn business planning and strategy.',
    image: 'https://source.unsplash.com/featured/?businessplanning',
  },
  {
    category: 'Business',
    title: 'Master financial statements and accounting.',
    image: 'https://source.unsplash.com/featured/?finance',
  },
  {
    category: 'Business',
    title: 'Explore market research techniques.',
    image: 'https://source.unsplash.com/featured/?marketresearch',
  },
  {
    category: 'Business',
    title: 'Develop negotiation and sales skills.',
    image: 'https://source.unsplash.com/featured/?sales',
  },

  // Languages
  {
    category: 'Languages',
    title: 'Improve your English grammar and vocabulary.',
    image: 'https://source.unsplash.com/featured/?english',
  },
  {
    category: 'Languages',
    title: 'Learn Spanish for everyday conversation.',
    image: 'https://source.unsplash.com/featured/?spanish',
  },
  {
    category: 'Languages',
    title: 'Practice listening and speaking skills.',
    image: 'https://source.unsplash.com/featured/?languagelearning',
  },
  {
    category: 'Languages',
    title: 'Boost reading comprehension with short stories.',
    image: 'https://source.unsplash.com/featured/?reading',
  },
  {
    category: 'Languages',
    title: 'Write better essays and articles in English.',
    image: 'https://source.unsplash.com/featured/?writing',
  }
  // Add more per category if needed
];

  get filteredCards() {
    return this.designCards.filter(card => card.category === this.activeCategory);
  }

 

}