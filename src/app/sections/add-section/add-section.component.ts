import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { SectionDto } from '../section-model';
import { UrlsService } from '../../services/urls.service';
import { CreateQuizComponent } from '../create-quiz/create-quiz.component';
import { NavbarComponent } from '../../navbars/navbar/navbar.component';
import { AddVideosComponent } from '../add-video/add-video.component';
import { ProcessFlowComponent } from '../process-flow/process-flow.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-add-section',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    CreateQuizComponent,
    NavbarComponent,
    ProcessFlowComponent,
    AddVideosComponent,
    DragDropModule,
  ],
  templateUrl: './add-section.component.html',
  styleUrls: ['./add-section.component.css'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1 })),
      transition(':enter', [style({ opacity: 0 }), animate('400ms ease-in')]),
      transition(':leave', [animate('400ms ease-out', style({ opacity: 0 }))]),
    ]),
  ],
})
export class AddSectionComponent implements OnInit {
  courseId!: number;
  currentUserId!: number;
  sections: (SectionDto & UIProps)[] = [];
  newSection: SectionDto = this.initSection();

  constructor(
    private urls: UrlsService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getUserId() ?? 0;
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.courseId) {
      this.toastr.error('Invalid course ID.');
      return;
    }

    this.loadSections();
  }

  loadSections() {
    this.urls.getSectionsByCourse(this.courseId).subscribe({
      next: (data) => {
        this.sections = data.map((section) => ({
          ...section,
          expanded: false,
          showQuizForm: false,
          showVideoForm: false,
          quizCount: 0,
          quizzes: [],
          videos: [],
        }));

        this.sections.forEach((section, index) => {
          if (section.sectionId) {
            this.urls.getQuizzesBySection(section.sectionId).subscribe({
              next: (quizzes) => {
                this.sections[index].quizCount = quizzes.length;
                this.sections[index].quizzes = quizzes;
              },
              error: () => {
                this.sections[index].quizCount = 0;
              },
            });

            this.urls.getVideosBySection(section.sectionId).subscribe({
              next: (videos) => {
                this.sections[index].videos = videos;
              },
              error: () => {
                this.sections[index].videos = [];
              },
            });
          }
        });

        this.loadSectionOrders();
        this.toastr.success('Sections loaded.');
      },
      error: () => this.toastr.error('Failed to load sections.'),
    });
  }

  loadSectionOrders() {
    this.urls.getSectionOrders(this.currentUserId, this.courseId).subscribe({
      next: (orders) => {
        this.sections.forEach((section) => {
          const order = orders.find((o) => o.sectionId === section.sectionId);
          section.sectionOrder = order ? order.sectionOrder : 9999;
        });

        this.sections.sort((a, b) => (a.sectionOrder! - b.sectionOrder!));
      },
      error: () => {
        this.toastr.error('Failed to load section orders.');
      },
    });
  }

  saveSectionOrder(section: SectionDto) {
    if (!section.sectionId || !section.sectionOrder) {
      this.toastr.warning('Invalid section or order.');
      return;
    }

    const payload = {
      userId: this.currentUserId,
      createCourseId: this.courseId,
      sectionId: section.sectionId,
      sectionOrder: section.sectionOrder,
    };

    console.log('Saving order:', payload);

    this.urls.saveSectionOrder(payload).subscribe({
      next: () => {
        this.toastr.success(`Order saved for "${section.sectionName}".`);
        this.loadSectionOrders();
      },
      error: (err) => {
        console.error('Order save failed', payload, err);
        this.toastr.error('Failed to save section order.');
      },
    });
  }

  toggleSection(index: number) {
    this.sections[index].expanded = !this.sections[index].expanded;
  }

  moveSectionUp(index: number) {
    if (index > 0) {
      [this.sections[index], this.sections[index - 1]] = [
        this.sections[index - 1],
        this.sections[index],
      ];
      this.updateSectionOrders();
    }
  }

  moveSectionDown(index: number) {
    if (index < this.sections.length - 1) {
      [this.sections[index], this.sections[index + 1]] = [
        this.sections[index + 1],
        this.sections[index],
      ];
      this.updateSectionOrders();
    }
  }



updateSectionOrders() {
  this.sections.forEach((section, i) => {
    section.sectionOrder = i + 1;
  });

 this.sections.forEach((section) => {
    if (section.sectionId) {
      const payload = {
        userId: this.currentUserId,
        createCourseId: this.courseId,
        sectionId: section.sectionId,
        sectionOrder: section.sectionOrder!,
      };

      this.urls.saveSectionOrder(payload).subscribe({
        next: () => {
          this.toastr.success(`Order updated: ${section.sectionName}`);
        },
        error: () => {
          this.toastr.error(`Failed to save order for ${section.sectionName}`);
        }
      });
    }
  });
}



dropSection(event: CdkDragDrop<(SectionDto & UIProps)[]>) {    moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
    this.updateSectionOrders();
    this.toastr.success('Section order updated');
  }

  saveSection(section: SectionDto) {
    section.createCourseId = this.courseId;

    this.urls.saveSection(section).subscribe({
      next: () => {
        this.toastr.success('Section saved.');
        this.loadSections();
      },
      error: () => this.toastr.error('Failed to save section.'),
    });
  }

  deleteSection(id: number) {
    if (confirm('Are you sure you want to delete this section?')) {
      this.urls.deleteSection(id).subscribe({
        next: () => {
          this.toastr.info('Section deleted.');
          this.loadSections();
        },
        error: () => this.toastr.error('Failed to delete section.'),
      });
    }
  }

  addSection() {
    this.newSection.createCourseId = this.courseId;

    this.urls.saveSection(this.newSection).subscribe({
      next: () => {
        this.toastr.success('New section added.');
        this.newSection = this.initSection();
        this.loadSections();
      },
      error: () => this.toastr.error('Failed to add section.'),
    });
  }

  addTempSection() {
    const temp: SectionDto & UIProps = {
      sectionId: 0,
      sectionName: '',
      sectionObjective: '',
      sectionCreatedDate: new Date(),
      sectionUpdatedDate: null,
      createdByUserId: this.currentUserId,
      isActive: true,
      createCourseId: this.courseId,
      expanded: true,
      showQuizForm: false,
      showVideoForm: false,
      quizzes: [],
      videos: [],
      quizCount: 0,
      sectionOrder: this.sections.length + 1,
    };

    this.sections.push(temp);
  }

  toggleQuizForm(section: any) {
    section.showQuizForm = !section.showQuizForm;
  }

  toggleVideoForm(section: any) {
    section.showVideoForm = !section.showVideoForm;
  }

  private initSection(): SectionDto {
    return {
      sectionId: 0,
      sectionName: '',
      sectionObjective: '',
      sectionCreatedDate: new Date(),
      sectionUpdatedDate: null,
      createdByUserId: this.currentUserId,
      isActive: true,
      createCourseId: this.courseId || 0,
    };
  }
}

interface UIProps {
  expanded: boolean;
  showQuizForm?: boolean;
  showVideoForm?: boolean;
  quizzes?: any[];
  videos?: any[];
  quizCount?: number;
  sectionOrder?: number;
}
