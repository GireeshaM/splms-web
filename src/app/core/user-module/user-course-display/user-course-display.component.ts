import { ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UrlsService } from '../../../services/urls.service';
import { SectionDto, VideoSummaryDto, QuizDto  } from '../../../sections/section-model';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { NavbarComponent } from '../../../navbars/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { SharedDataService } from '../../../services/shared-data.service';

@Component({
  selector: 'app-user-course-display',
  templateUrl: './user-course-display.component.html',
  imports: [CommonModule, NavbarComponent],
  styleUrl: './user-course-display.component.css'
})
export class UserCourseDisplayComponent implements OnInit {
  courseId!: number;
  instructorUserId!: number | null;
  @Input() authUserId!: number;
  courseName = '';
  sections: SectionDto[] = [];
  selectedSection: SectionDto | null = null;
  selectedVideo: VideoSummaryDto | null = null;
  selectedQuiz: QuizDto | null = null;
  videoUrl: SafeResourceUrl | null = null;
  expandedSectionIds: number[] = [];
  sidebarOpen: boolean = true;
  loadingVideo: boolean = false;

  // Quiz state
  quizStarted: boolean = false;
  quizQuestions: any[] = [];
  currentQuestionIndex: number = 0;
  quizAnswers: { [questionId: number]: any } = {};
  quizTimer: number = 0;
  timerInterval: any = null;

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
    private cdr: ChangeDetectorRef,
    private sharedData: SharedDataService
  ) {}

  ngOnInit() {
    this.courseId = Number(this.route.snapshot.paramMap.get('id'));
    this.sharedData.instructorUserId$.subscribe(id => {
      if (id) {
        this.instructorUserId = id;
        console.log('Instructor User ID from service:', id);
        this.loadCourseDetails();
        this.loadSectionsInOrder();
      }
    });
  }

  loadCourseDetails() {
    this.urls.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.courseName = course.courseTitle;
      },
      error: () => {
        this.courseName = 'Unknown Course';
      }
    });
  }

  loadSections() {
    this.urls.getSectionsByCourse(this.courseId).subscribe((sections) => {
      this.sections = sections;
      this.sections.forEach((section, sectionIdx) => {
        this.urls.getVideosBySection(section.sectionId!).subscribe((videos) => {
          section.videos = videos;
          this.urls.getQuizzesBySection(section.sectionId!).subscribe((quizzes: QuizDto[]) => {
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

  loadSectionsInOrder() {
    if (this.instructorUserId != null && this.courseId != null) {
      this.urls.getSectionOrders(this.instructorUserId, this.courseId).subscribe({
        next: (sectionOrderArr) => {
          // Sort by sectionOrder
          const sortedOrder = [...sectionOrderArr].sort((a, b) => a.sectionOrder - b.sectionOrder);
          // Fetch all sections for the course
          this.urls.getSectionsByCourse(this.courseId).subscribe((allSections: SectionDto[]) => {
            // Map sorted section IDs to actual section objects
            this.sections = sortedOrder
              .map(order => allSections.find(sec => sec.sectionId === order.sectionId))
              .filter(sec => !!sec) as SectionDto[];
            // Load videos/quizzes for each section as before
            this.sections.forEach((section, sectionIdx) => {
              this.urls.getVideosBySection(section.sectionId!).subscribe((videos) => {
                section.videos = videos;
                this.urls.getQuizzesBySection(section.sectionId!).subscribe((quizzes: QuizDto[]) => {
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
        },
        error: (err) => {
          this.sections = [];
          console.error(err);
        }
      });
    }
  }

  toggleSection(section: SectionDto) {
    const sectionId = section.sectionId ?? -1;
    const idx = this.expandedSectionIds.indexOf(sectionId);
    if (idx > -1) {
      this.expandedSectionIds.splice(idx, 1);
    } else {
      this.expandedSectionIds.push(sectionId);
    }
    this.selectedSection = section;
  }

  selectVideo(video: VideoSummaryDto) {
    this.selectedQuiz = null;
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
    this.selectedVideo = null;
    this.videoUrl = null;
    this.quizStarted = false;
    this.quizQuestions = [];
    this.quizAnswers = {};
    this.currentQuestionIndex = 0;
    this.quizResults = {};
    this.totalMarks = 0;
    this.stopTimer();
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
      .subscribe((questions: any[]) => {
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

  isMultiAnswer(question: any): boolean {
    return (
      (question.answers?.filter((a: any) => a.answerCorrectOrNot === true).length ?? 0) > 1
    );
  }

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

    this.quizQuestions.forEach((q: any) => {
      const correctAnswers = (q.answers ?? [])
        .filter((a: any) => a.answerCorrectOrNot === true)
        .map((a: any) => a.QuizAnswerText || a.quizAnswerText || a.answerText);
      const selected = this.quizAnswers[q.quizQuestionId!];

      let isCorrect = false;
      if (this.isMultiAnswer(q)) {
        const selectedArr = Array.isArray(selected) ? selected : [];
        isCorrect =
          selectedArr.length === correctAnswers.length &&
          correctAnswers.every((ans: any) => selectedArr.includes(ans));
      } else {
        isCorrect = correctAnswers.includes(selected);
      }
      if (isCorrect) this.totalMarks++;

      this.quizResults[q.quizQuestionId!] = {
        isCorrect,
        selected,
        correctAnswer: correctAnswers.join(', '),
        answerDescription:
          q.answers?.find((a: any) => a.answerCorrectOrNot === true)
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
          if (idx < section.videos.length - 1) {
            return section.videos[idx + 1];
          }
          for (let j = i + 1; j < this.sections.length; j++) {
            const nextSection = this.sections[j];
            if (nextSection.videos && nextSection.videos.length > 0) {
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
          if (idx > 0) {
            return section.videos[idx - 1];
          }
          for (let j = i - 1; j >= 0; j--) {
            const prevSection = this.sections[j];
            if (prevSection.videos && prevSection.videos.length > 0) {
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
  }

  goToNextSectionVideo() {
    const currentSectionIdx = this.sections.findIndex((section) =>
      section.quizzes?.some(
        (q) => q.createQuizId === this.selectedQuiz?.createQuizId
      )
    );
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