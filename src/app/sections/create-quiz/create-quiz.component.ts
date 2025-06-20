import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {  QuizDto, SectionDto } from '../section-model';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UrlsService } from '../../services/urls.service';
import { QuizQuestionComponent } from '../quiz-question/quiz-question.component';

@Component({
  selector: 'app-create-quiz',
  imports: [ReactiveFormsModule, CommonModule, FormsModule,QuizQuestionComponent],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css',
})
export class CreateQuizComponent implements OnInit {
  @Input() sectionId!: number;
  @Output() quizAdded: EventEmitter<QuizDto> = new EventEmitter<QuizDto>();


  quizzes: any[] = [];
  newQuiz = this.initQuiz();
  showNewQuizForm = false;
  newQuizExpanded = false;
  quizzesVisible: boolean = true;
   sections: SectionDto[] = [];
  courseId: number = 0;

  constructor(private urls: UrlsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    if (this.sectionId) {
      this.loadQuizzes();
       this.loadSections();
    }
  }

  initQuiz() {
    return {
      createQuizId: 0,
      quizTitle: '',
      quizDescription: '',
      sectionId: this.sectionId,
      createdByUserId: 1,
    };
  }

   loadSections() {
    this.urls.getSectionsByCourse(this.courseId).subscribe((sections: SectionDto[]) => {
      this.sections = sections.map(section => ({
        ...section,
        quizzes: section.quizzes || []  // Ensure quizzes is initialized as an empty array if it's undefined
      }));
    });
  }

  loadQuizzes() {
    this.urls.getQuizzesBySection(this.sectionId).subscribe({
      next: (res) => {
        this.quizzes = res.map((q) => ({
          ...q,
          expanded: false,
          editingTitle: q.quizTitle,
          editingDescription: q.quizDescription,
        }));
      },
      error: () => this.toastr.error('Failed to load quizzes'),
    });
  }

  toggleAllQuizzes() {
    this.quizzesVisible = !this.quizzesVisible;
  }

  toggleNewQuizForm() {
    this.showNewQuizForm = !this.showNewQuizForm;
    this.newQuizExpanded = true;
  }

  toggleNewQuizExpand() {
    this.newQuizExpanded = !this.newQuizExpanded;
  }

  toggleQuizExpand(quiz: any) {
    quiz.expanded = !quiz.expanded;
  }

  saveQuiz() {
    this.newQuiz.sectionId = this.sectionId;
    this.urls.saveQuiz(this.newQuiz).subscribe({
      next: () => {
        this.toastr.success('Quiz saved.');
        this.newQuiz = this.initQuiz();
        this.showNewQuizForm = false;
        this.loadQuizzes();
      },
      error: () => this.toastr.error('Failed to save quiz.'),
    });
  }

  deleteQuiz(id: number) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.urls.deleteQuiz(id).subscribe({
        next: () => {
          this.toastr.info('Quiz deleted.');
          this.loadQuizzes();
        },
        error: () => this.toastr.error('Failed to delete quiz.'),
      });
    }
  }

  updateQuiz(quiz: any) {
    const updatedQuiz = {
      ...quiz,
      quizTitle: quiz.editingTitle,
      quizDescription: quiz.editingDescription,
      quizUpdateTime: new Date(),
      sectionId: this.sectionId,
      createdByUserId: quiz.createdByUserId || 1,
    };

    this.urls.saveQuiz(updatedQuiz).subscribe({
      next: () => {
        this.toastr.success('Quiz updated.');
        quiz.quizTitle = quiz.editingTitle;
        quiz.quizDescription = quiz.editingDescription;
        quiz.expanded = false;
      },
      error: () => this.toastr.error('Failed to update quiz.'),
    });
  }

  moveQuizUp(index: number) {
    if (index > 0) {
      const temp = this.quizzes[index];
      this.quizzes[index] = this.quizzes[index - 1];
      this.quizzes[index - 1] = temp;
    }
  }

  moveQuizDown(index: number) {
    if (index < this.quizzes.length - 1) {
      const temp = this.quizzes[index];
      this.quizzes[index] = this.quizzes[index + 1];
      this.quizzes[index + 1] = temp;
    }
  }

   quizTitle: string = '';
  quizDescription: string = '';


   createQuiz() {
    const newQuiz: QuizDto = {
      createQuizId: Date.now(),  // Generate a unique ID (or get it from the backend)
      quizTitle: this.quizTitle,
      quizDescription: this.quizDescription,
      expanded: false
    };

    // Emit the new quiz
    this.quizAdded.emit(newQuiz);

    // Clear the form fields
    this.quizTitle = '';
    this.quizDescription = '';
  }
}
