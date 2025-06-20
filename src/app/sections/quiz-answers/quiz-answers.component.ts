import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../../services/urls.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-quiz-answers',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './quiz-answers.component.html',
  styleUrl: './quiz-answers.component.css',
})
export class QuizAnswersComponent implements OnInit {
  @Input() questionId!: number;

  answers: any[] = [];
  newAnswer: any = this.initAnswer();
  showNewAnswerForm: boolean = false;

  constructor(private urls: UrlsService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadAnswers();
  }

  private initAnswer(): any {
    return {
      quizAnswerId: 0,
      quizAnswerText: '',
      answerDescription: '',
      answerCorrectOrNot: false,
      quizQuestionId: this.questionId,
      editing: false,
    };
  }

  loadAnswers(): void {
    this.urls.getAnswersByQuestionId(this.questionId).subscribe({
      next: (res) => {
        this.answers = res.map((a) => ({
          ...a,
          editing: false,
        }));
      },
      error: () => this.toastr.error('Failed to load answers'),
    });
  }

  saveAnswer(): void {
    if (!this.newAnswer.quizAnswerText.trim()) {
      this.toastr.warning('Answer text cannot be empty');
      return;
    }

    this.newAnswer.quizQuestionId = this.questionId;

    this.urls.saveAnswer(this.newAnswer).subscribe({
      next: () => {
        this.toastr.success('Answer added');
        this.newAnswer = this.initAnswer();
        this.showNewAnswerForm = false;
        this.loadAnswers();
      },
      error: () => this.toastr.error('Failed to add answer'),
    });
  }

  updateAnswer(answer: any): void {
    this.urls.saveAnswer(answer).subscribe({
      next: () => {
        this.toastr.success('Answer updated');
        answer.editing = false;
        this.loadAnswers();
      },
      error: () => this.toastr.error('Failed to update answer'),
    });
  }

  deleteAnswer(answerId: number): void {
    if (confirm('Are you sure you want to delete this answer?')) {
      this.urls.deleteAnswer(answerId).subscribe({
        next: () => {
          this.toastr.info('Answer deleted');
          this.loadAnswers();
        },
        error: () => this.toastr.error('Failed to delete answer'),
      });
    }
  }

  moveUp(index: number): void {
    if (index > 0) {
      [this.answers[index], this.answers[index - 1]] = [this.answers[index - 1], this.answers[index]];
    }
  }

  moveDown(index: number): void {
    if (index < this.answers.length - 1) {
      [this.answers[index], this.answers[index + 1]] = [this.answers[index + 1], this.answers[index]];
    }
  }

  toggleNewAnswer(): void {
    this.showNewAnswerForm = !this.showNewAnswerForm;
  }

  toggleEdit(answer: any): void {
    answer.editing = !answer.editing;
  }
}