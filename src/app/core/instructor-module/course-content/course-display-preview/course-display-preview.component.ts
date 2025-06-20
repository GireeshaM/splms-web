import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../../../navbars/navbar/navbar.component';
import {
  QuizDto,
  QuizQuestion,
  SectionDto,
  VideoSummaryDto,
} from '../../../../sections/section-model';
import { UrlsService } from '../../../../services/urls.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-course-display-preview',
  imports: [NavbarComponent, ReactiveFormsModule, CommonModule],
  templateUrl: './course-display-preview.component.html',
  styleUrl: './course-display-preview.component.css',
})
export class CourseDisplayPreviewComponent implements OnInit {
  courseId!: number;
  courseName = 'C# and .NET Essential Training'; // Set or get from route
  sections: SectionDto[] = [];
  selectedSection: SectionDto | null = null;
  selectedVideo: VideoSummaryDto | null = null;
  selectedQuiz: QuizDto | null = null;
  videoUrl: SafeResourceUrl | null = null;
  expandedSectionIds: number[] = []; // Track multiple expanded sections
  sidebarOpen: boolean = true;
  loadingVideo: boolean = false; // <-- Add loading state

  // Quiz state
  quizStarted: boolean = false;
  quizQuestions: (QuizQuestion & { answers?: any[] })[] = [];
  currentQuestionIndex: number = 0;
  quizAnswers: { [questionId: number]: any } = {};
  quizTimer: number = 0; // in seconds
  timerInterval: any = null;

  // Results state
  quizResults: {
    [questionId: number]: {
      isCorrect: boolean;
      selected: any;
      correctAnswer: any;
      answerDescription: string;
    };
  } = {};
  totalMarks: number = 0;

  constructor(
    private urls: UrlsService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.courseId) {
      this.loadCourseDetails(); // fetch course name
      this.loadSections(); // fetch sections and videos
    }
  }

  loadCourseDetails() {
    this.urls.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseName = course.courseTitle;
      },
      error: (err) => {
        console.error('Failed to load course details:', err);
        this.courseName = 'Unknown Course';
      },
    });
  }

  loadSections() {
    this.urls.getSectionsByCourse(this.courseId).subscribe((sections) => {
      this.sections = sections;
      this.sections.forEach((section, sectionIdx) => {
        // Load videos
        this.urls.getVideosBySection(section.sectionId!).subscribe((videos) => {
          section.videos = videos;
          // Load quizzes
          this.urls
            .getQuizzesBySection(section.sectionId!)
            .subscribe((quizzes: QuizDto[]) => {
              section.quizzes = quizzes;
              // Load the first section's first video initially
              if (
                sectionIdx === 0 &&
                videos &&
                videos.length > 0 &&
                !this.selectedVideo
              ) {
                setTimeout(() => {
                  this.expandedSectionIds.push(section.sectionId!);
                  this.selectedSection = section;
                  this.selectVideo(videos[0]);
                  this.cdr.detectChanges();
                });
              }
            });
        });
      });
    });
  }

  toggleSection(section: SectionDto) {
    const sectionId = section.sectionId ?? -1;
    const idx = this.expandedSectionIds.indexOf(sectionId);
    if (idx > -1) {
      this.expandedSectionIds.splice(idx, 1); // Collapse if already open
    } else {
      this.expandedSectionIds.push(sectionId); // Expand
    }
    this.selectedSection = section;
    // Do NOT reset selectedVideo or videoUrl here
  }

  selectVideo(video: VideoSummaryDto) {
    this.selectedQuiz = null; // Deselect quiz if any
    this.quizStarted = false;
    this.loadingVideo = true;
    this.selectedVideo = video;
    this.videoUrl = null;
    this.quizQuestions = [];
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.stopTimer();
    this.urls.getDecryptedVideo(video.videoId).subscribe({
      next: (blob) => {
        if (video.fileType === '.pdf') {
          // Add #toolbar=0 to hide PDF toolbar
          const url = URL.createObjectURL(blob) + '#toolbar=0';
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        } else {
          const url = URL.createObjectURL(blob);
          this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        }
        setTimeout(() => {
          this.loadingVideo = false;
        });
      },
      error: () => {
        setTimeout(() => {
          this.loadingVideo = false;
        });
      },
    });
  }

  selectQuiz(quiz: QuizDto) {
    this.selectedQuiz = quiz;
    this.selectedVideo = null; // Deselect video if any
    this.videoUrl = null; // Remove video URL
    this.quizStarted = false;
    this.quizQuestions = [];
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.quizResults = {};
    this.totalMarks = 0;
    this.stopTimer();
    // DO NOT call selectVideo here!
  }

  startQuiz() {
    if (!this.selectedQuiz) return;
    this.quizStarted = true;
    this.currentQuestionIndex = 0;
    this.quizAnswers = {};
    this.quizQuestions = [];
    this.quizResults = {};
    this.totalMarks = 0;
    this.urls
      .getQuizQuestionsByQuizId(this.selectedQuiz.createQuizId)
      .subscribe((questions: QuizQuestion[]) => {
        // Fetch answers for each question and attach as 'answers'
        const answerRequests = questions.map((q) =>
          this.urls.getAnswersByQuestionId(q.quizQuestionId!)
        );
        forkJoin(answerRequests).subscribe((answersArr) => {
          questions.forEach((q, idx) => {
            (q as any).answers = answersArr[idx];
          });
          this.quizQuestions = questions;
          this.quizTimer = questions.length * 60;
          this.startTimer();
        });
      });
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      if (this.quizTimer > 0) {
        this.quizTimer--;
      } else {
        this.submitQuiz();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  // Helper: is this question multi-answer?
  isMultiAnswer(question: QuizQuestion & { answers?: any[] }): boolean {
    return (
      (question.answers?.filter((a) => a.answerCorrectOrNot === true).length ??
        0) > 1
    );
  }

  // For multi-answer questions, toggle selection in an array
  toggleMultiAnswer(questionId: number, answer: string, checked: boolean) {
    if (!Array.isArray(this.quizAnswers[questionId])) {
      this.quizAnswers[questionId] = [];
    }
    if (checked) {
      if (!this.quizAnswers[questionId].includes(answer)) {
        this.quizAnswers[questionId].push(answer);
      }
    } else {
      this.quizAnswers[questionId] = this.quizAnswers[questionId].filter(
        (a: string) => a !== answer
      );
    }
  }

  selectAnswer(questionId: number, answer: any) {
    this.quizAnswers[questionId] = answer;
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.quizQuestions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  submitQuiz() {
    this.stopTimer();
    this.quizStarted = false;
    this.totalMarks = 0;
    this.quizResults = {};

    this.quizQuestions.forEach((q) => {
      const correctAnswers = (q.answers ?? [])
        .filter((a) => a.answerCorrectOrNot === true)
        .map((a) => a.QuizAnswerText || a.quizAnswerText || a.answerText);
      const selected = this.quizAnswers[q.quizQuestionId!];

      let isCorrect = false;
      if (this.isMultiAnswer(q)) {
        // Multi-answer: selected must be array, match all correct, no extra
        const selectedArr = Array.isArray(selected) ? selected : [];
        isCorrect =
          selectedArr.length === correctAnswers.length &&
          correctAnswers.every((ans) => selectedArr.includes(ans));
      } else {
        // Single-answer
        isCorrect = correctAnswers.includes(selected);
      }
      if (isCorrect) this.totalMarks++;

      // For display, show all selected and correct answers
      this.quizResults[q.quizQuestionId!] = {
        isCorrect,
        selected,
        correctAnswer: correctAnswers.join(', '),
        answerDescription:
          q.answers?.find((a) => a.answerCorrectOrNot === true)
            ?.answerDescription || '',
      };
    });
  }

  getNextVideo(): VideoSummaryDto | null {
    if (!this.selectedVideo) return null;
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if (section.videos) {
        const idx = section.videos.findIndex(
          (v) => v.videoId === this.selectedVideo!.videoId
        );
        if (idx > -1) {
          // If not last video in section, return next
          if (idx < section.videos.length - 1) {
            return section.videos[idx + 1];
          }
          // If last video, check next section for videos
          for (let j = i + 1; j < this.sections.length; j++) {
            const nextSection = this.sections[j];
            if (nextSection.videos && nextSection.videos.length > 0) {
              // Open the next section if it's not already expanded
              const nextSectionId = nextSection.sectionId ?? -1;
              if (!this.expandedSectionIds.includes(nextSectionId)) {
                this.expandedSectionIds.push(nextSectionId);
              }
              return nextSection.videos[0];
            }
          }
        }
      }
    }
    return null;
  }

  goToNextVideo() {
    const next = this.getNextVideo();
    if (next) {
      this.selectVideo(next);
    }
  }

  getPrevVideo(): VideoSummaryDto | null {
    if (!this.selectedVideo) return null;
    for (let i = 0; i < this.sections.length; i++) {
      const section = this.sections[i];
      if (section.videos) {
        const idx = section.videos.findIndex(
          (v) => v.videoId === this.selectedVideo!.videoId
        );
        if (idx > -1) {
          // If not first video in section, return previous
          if (idx > 0) {
            return section.videos[idx - 1];
          }
          // If first video, check previous section for videos
          for (let j = i - 1; j >= 0; j--) {
            const prevSection = this.sections[j];
            if (prevSection.videos && prevSection.videos.length > 0) {
              // Open the previous section if it's not already expanded
              const prevSectionId = prevSection.sectionId ?? -1;
              if (!this.expandedSectionIds.includes(prevSectionId)) {
                this.expandedSectionIds.push(prevSectionId);
              }
              return prevSection.videos[prevSection.videos.length - 1];
            }
          }
        }
      }
    }
    return null;
  }

  goToPrevVideo() {
    const prev = this.getPrevVideo();
    if (prev) {
      this.selectVideo(prev);
    }
  }

  retakeQuiz() {
    this.quizStarted = false;
    this.quizQuestions = [];
    this.quizAnswers = {};
    this.quizResults = {};
    this.totalMarks = 0;
    // The UI will now show the Start Now screen again
  }

  goToNextSectionVideo() {
    // Find the current section index
    const currentSectionIdx = this.sections.findIndex((section) =>
      section.quizzes?.some(
        (q) => q.createQuizId === this.selectedQuiz?.createQuizId
      )
    );
    // Find the next section with at least one video
    for (let i = currentSectionIdx + 1; i < this.sections.length; i++) {
      const nextSection = this.sections[i];
      if (nextSection.videos && nextSection.videos.length > 0) {
        if (!this.expandedSectionIds.includes(nextSection.sectionId!)) {
          this.expandedSectionIds.push(nextSection.sectionId!);
        }
        this.selectVideo(nextSection.videos[0]);
        break;
      }
    }
  }
}
