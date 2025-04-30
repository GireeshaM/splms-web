import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  footerSections = [
    {
      title: 'Certifications by Issuer',
      items: ['AWS Certifications', 'Six Sigma Certifications', 'Microsoft Certifications', 'Cisco Certifications', 'Tableau Certifications', 'See all Certifications']
    },
    {
      title: 'Web Development',
      items: ['Web Development', 'JavaScript', 'React JS', 'Angular', 'Java']
    },
    {
      title: 'IT Certifications',
      items: ['Amazon AWS', 'Cloud Practitioner', 'Azure Fundamentals', 'Solutions Architect - Associate', 'Kubernetes']
    },
    {
      title: 'Leadership',
      items: ['Leadership', 'Management Skills', 'Project Management', 'Personal Productivity', 'Emotional Intelligence']
    },
    {
      title: 'Certifications by Skill',
      items: ['Cybersecurity Certification', 'Project Management Certification', 'Cloud Certification', 'Data Analytics Certification', 'HR Management Certification', 'See all Certifications']
    },
    {
      title: 'Data Science',
      items: ['Data Science', 'Python', 'Machine Learning', 'ChatGPT', 'Deep Learning']
    },
    {
      title: 'Communication',
      items: ['Communication Skills', 'Presentation Skills', 'Public Speaking', 'Writing', 'PowerPoint']
    }
  ];

  socialLinks = [
    {
      name: 'Facebook',
      iconClass: 'fab fa-facebook-f',
      url: 'https://www.facebook.com/YourPage'
    },
    {
      name: 'Instagram',
      iconClass: 'fab fa-instagram',
      url: 'https://www.instagram.com/YourPage'
    },
    {
      name: 'Twitter',
      iconClass: 'fab fa-twitter',
      url: 'https://www.twitter.com/YourPage'
    },
    {
      name: 'LinkedIn',
      iconClass: 'fab fa-linkedin-in',
      url: 'https://www.linkedin.com/in/YourPage'
    }
  ];
  footerBottomSections = [
    {
      title: 'About',
      links: ['About us', 'Careers', 'Contact us', 'Blog', 'Investors']
    },
    {
      title: 'Discover SLMS',
      links: ['Get the app', 'Teach on SLMS', 'Plans and Pricing', 'Affiliate', 'Help and Support']
    },
    {
      title: 'SLMS for Business',
      links: ['SLMS Business']
    },
    {
      title: 'Legal & Accessibility',
      links: ['Accessibility statement', 'Privacy policy', 'Sitemap', 'Terms']
    }
  ];
}