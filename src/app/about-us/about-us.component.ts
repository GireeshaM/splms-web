import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about-us',
  imports: [CommonModule],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {


  collaborationLogos = [
    {
      src: 'https://sprintpark.com/assets/home/copado.png',
      alt: 'Copado',
    },
    {
      src: 'https://sprintpark.com/assets/home/microsoft.png',
      alt: 'Microsoft',
    },
    {
      src: 'https://sprintpark.com/assets/home/google.png',
      alt: 'Google',
    },
    {
      src: 'https://sprintpark.com/assets/home/salesforce.png',
      alt: 'Salesforce',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
      alt: 'AWS',
    },
  ];
  values: Array<{ title: string, detail: string }> = [];

  ngOnInit(): void {
    this.values = [
      { title: 'Innovation', detail: 'Pushing boundaries with new technologies.' },
      { title: 'Integrity', detail: 'Maintaining transparency and ethical standards.' },
      { title: 'Collaboration', detail: 'Working together to achieve common goals.' }
    ];
}
}