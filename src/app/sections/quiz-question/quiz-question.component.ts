import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuizQuestion } from '../section-model';
import { UrlsService } from '../../services/urls.service';
import { ToastrService } from 'ngx-toastr';
import { QuizAnswersComponent } from '../quiz-answers/quiz-answers.component';

@Component({
  selector: 'app-quiz-question',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    QuizAnswersComponent,
  ],
  templateUrl: './quiz-question.component.html',
  styleUrl: './quiz-question.component.css',
})
export class QuizQuestionComponent implements OnInit {
  @Input() quizId!: number;

  questions: QuizQuestion[] = [];
  newQuestionText: string = '';
  showNewQuestion: boolean = false;
  allCollapsed: boolean = false;

  constructor(private urls: UrlsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    if (!this.quizId) return;
    this.urls.getQuizQuestionsByQuizId(this.quizId).subscribe({
      next: (res) => {
        this.questions = res.map((q) => ({
          ...q,
          editing: false,
          showAnswers: false, // Add showAnswers property to each question
        }));
      },
      error: () => this.toastr.error('Failed to load questions'),
    });
  }

  toggleNewQuestion() {
    this.showNewQuestion = !this.showNewQuestion;
  }
  toggleAllQuestions() {
    this.allCollapsed = !this.allCollapsed;
    this.questions.forEach((q) => (q.collapsed = this.allCollapsed));
  }

  toggleCollapse(question: QuizQuestion) {
    question.collapsed = !question.collapsed;
  }

  addQuestion() {
    if (!this.newQuestionText.trim()) {
      this.toastr.warning('Question text cannot be empty');
      return;
    }

    const newQ: QuizQuestion = {
      createQuizId: this.quizId,
      quizQuestionText: this.newQuestionText,
    };

    this.urls.saveQuizQuestion(newQ).subscribe({
      next: () => {
        this.toastr.success('Question added');
        this.newQuestionText = '';
        this.showNewQuestion = false;
        this.loadQuestions();
      },
      error: () => this.toastr.error('Failed to add question'),
    });
  }
  saveQuestion(question: QuizQuestion) {
    // Update existing question
    this.urls.saveQuizQuestion(question).subscribe({
      next: () => {
        this.toastr.success('Question updated');
        question.editing = false;
        this.loadQuestions();
      },
      error: () => this.toastr.error('Failed to update'),
    });
  }

  deleteQuestion(id: number) {
    if (confirm('Are you sure to delete this question?')) {
      this.urls.deleteQuizQuestion(id).subscribe({
        next: () => {
          this.toastr.info('Deleted');
          this.loadQuestions();
        },
        error: () => this.toastr.error('Failed to delete'),
      });
    }
  }

  moveUp(index: number): void {
    if (index > 0) {
      [this.questions[index], this.questions[index - 1]] = [
        this.questions[index - 1],
        this.questions[index],
      ];
    }
  }

  moveDown(index: number): void {
    if (index < this.questions.length - 1) {
      [this.questions[index], this.questions[index + 1]] = [
        this.questions[index + 1],
        this.questions[index],
      ];
    }
  }

  toggleEdit(question: QuizQuestion) {
    question.editing = !question.editing;
  }

  showQuestions: boolean = true;

  toggleQuestionsVisibility() {
    this.showQuestions = !this.showQuestions;
  }

  onAddAnswers(questionId: number): void {
    this.questions = this.questions.map((q) =>
      q.quizQuestionId === questionId
        ? { ...q, showAnswers: !q.showAnswers }
        : q
    );
  }

  toggleAnswers(question: QuizQuestion): void {
    question.showAnswers = !question.showAnswers;
  }
}
