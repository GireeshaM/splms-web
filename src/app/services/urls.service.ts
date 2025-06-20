import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CourseSection,
  CreateCourse,
  MyProfiles,
  QuizDto1,
  QuizQuestion,
  SectionDto,
  User,
  VideoSummaryDto,
} from '../sections/section-model';
import { Category, SubCategory } from '../Basic/Models';
import { Course } from '../core/instructor-module/instructor-models';
import { UserRegisterDto } from '../home/homeModel';

@Injectable({
  providedIn: 'root',
})
export class UrlsService {
  private readonly baseUrl = 'https://localhost:7215/api/Section';
  private readonly quizUrl = 'https://localhost:7215/api/Quiz';
  private readonly quizQuestionUrl = 'https://localhost:7215/api/QuizQuestions';
  private readonly quizAnswerUrl = 'https://localhost:7215/api/QuizAnswer';
  private readonly categoryUrl = 'https://localhost:7215/api/Categories'; // Add full URL
  private readonly subCategoryUrl = 'https://localhost:7215/api/SubCategories';
  private readonly addCategoryUrl = 'https://localhost:7215/api/Categories';
  private readonly addSubCategoryUrl =
    'https://localhost:7215/api/SubCategories';
  private readonly videoUrl = 'https://localhost:7215/api/Video';
  private readonly lessonsOrderUrl = 'https://localhost:7215/api/LessonsOrder';
  private readonly sectionOrderUrl =
    'https://localhost:7215/api/CourseSectionsOrder';
  private apiUrl = 'https://localhost:7215/api/Course';
  private authUrl = 'https://localhost:7215/api/auth';
  private userUrl = 'https://localhost:7215/api/Auth/get-user';
  private courseFaqUrl = 'https://localhost:7215/api/CourseFaqs';
  private getCoursesUrl = 'https://localhost:7215/api/GetCourses';
 private wishListUrl = 'https://localhost:7215/api/UserInteraction';


  constructor(private http: HttpClient) {}

  // Get sections by course ID
  getSectionsByCourse(courseId: number): Observable<SectionDto[]> {
    return this.http.get<SectionDto[]>(`${this.baseUrl}/ByCourse/${courseId}`);
  }

  getCourseById(id: number): Observable<CreateCourse> {
    return this.http.get<CreateCourse>(`${this.apiUrl}/${id}`);
  }

  // Save (create or update) section
  saveSection(section: SectionDto): Observable<any> {
    return this.http.post(this.baseUrl, section);
  }

  // Delete section by ID
  deleteSection(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  saveQuiz(quiz: any): Observable<any> {
    return this.http.post(`${this.quizUrl}`, quiz);
  }

  getQuizzesBySection(sectionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.quizUrl}/section/${sectionId}`);
  }

  deleteQuiz(id: number): Observable<void> {
    return this.http.delete<void>(`${this.quizUrl}/${id}`);
  }

  getQuizQuestionsByQuizId(quizId: number): Observable<QuizQuestion[]> {
    return this.http.get<QuizQuestion[]>(
      `${this.quizQuestionUrl}/byCreateQuizId/${quizId}`
    );
  }

  saveQuizQuestion(question: QuizQuestion): Observable<any> {
    return this.http.post(this.quizQuestionUrl, question, {
      responseType: 'text',
    });
  }

  deleteQuizQuestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.quizQuestionUrl}/${id}`);
  }

  getAnswersByQuestionId(questionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.quizAnswerUrl}/question/${questionId}`);
  }

  // Save a new answer
  saveAnswer(answer: any): Observable<any> {
    return this.http.post<any>(`${this.quizAnswerUrl}/save`, answer);
  }

  // Delete an answer by ID
  deleteAnswer(answerId: number): Observable<void> {
    return this.http.delete<void>(`${this.quizAnswerUrl}/${answerId}`);
  }

  // Update an existing answer
  updateAnswer(answerId: number, updatedAnswer: any): Observable<any> {
    return this.http.put<any>(
      `${this.quizAnswerUrl}/update/${answerId}`,
      updatedAnswer
    );
  }

  getProfileByUserId(userId: number): Observable<any> {
    return this.http.get<any>(
      `https://localhost:7215/api/MyProfiles/${userId}`
    );
  }

  getProfilesByUserId(userId: number): Observable<MyProfiles> {
    return this.http.get<MyProfiles>(
      `https://localhost:7215/api/MyProfiles/${userId}`
    );
  }

  saveProfile(profile: any): Observable<any> {
    return this.http.post<any>(
      'https://localhost:7215/api/MyProfiles',
      profile
    );
  }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.categoryUrl);
  }

  // Subcategories by categoryId
  getSubCategories(categoryId: string | number): Observable<SubCategory[]> {
    return this.http.get<SubCategory[]>(
      `${this.subCategoryUrl}/ByCategory/${categoryId}`
    );
  }
  addCategory(category: any): Observable<any> {
    return this.http.post<Category>(this.addCategoryUrl, category);
  }
  addSubCategory(subCategory: any): Observable<any> {
    return this.http.post<SubCategory>(this.addSubCategoryUrl, subCategory);
  }

  getCoursesByUserId(userId: number): Observable<Course[]> {
    return this.http.get<Course[]>(
      `https://localhost:7215/api/Course/ByUserId/${userId}`
    );
  }

  getVideosBySection(sectionId: number): Observable<VideoSummaryDto[]> {
    return this.http.get<VideoSummaryDto[]>(
      `${this.videoUrl}/section/${sectionId}/videos`
    );
  }

  // Upload or update a video (multipart/form-data)
  uploadVideo(formData: FormData): Observable<any> {
    return this.http.post(`${this.videoUrl}/videos`, formData);
  }

  // Delete a video by ID
  deleteVideo(videoId: number): Observable<string> {
    return this.http.delete(`${this.videoUrl}/videos/${videoId}`, {
      responseType: 'text',
    });
  }

  // Get decrypted video (for streaming or download)
  getDecryptedVideo(videoId: number): Observable<Blob> {
    return this.http.get(`${this.videoUrl}/decrypted/${videoId}`, {
      responseType: 'blob',
    });
  }
  // --- LessonsOrder APIs for ordering videos/quizzes ---

  // Save or update a list of lesson orders (videos/quizzes order)
  // ...existing code...

  // Save or update a list of lesson orders (for videos or quizzes)
  saveOrUpdateLessonsOrders(orders: any[]): Observable<any> {
    return this.http.post(`${this.lessonsOrderUrl}/saveOrUpdate`, orders);
  }

  // Get orderId by videoId
  getOrderIdByVideoId(videoId: number): Observable<number | null> {
    return this.http.get<number | null>(
      `${this.lessonsOrderUrl}/getOrderIdByVideoId/${videoId}`
    );
  }

  // Get orderId by quizId
  getOrderIdByQuizId(quizId: number): Observable<number | null> {
    return this.http.get<number | null>(
      `${this.lessonsOrderUrl}/getOrderIdByQuizId/${quizId}`
    );
  }

  // Get all section orders for a course/user
  getSectionOrders(userId: number, courseId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.sectionOrderUrl}/${userId}/${courseId}`
    );
  }
  // ...existing code...

  // Save or update a section order
  saveSectionOrder(order: {
    userId: number;
    createCourseId: number;
    sectionId: number;
    sectionOrder: number;
  }): Observable<any> {
    return this.http.post(`${this.sectionOrderUrl}`, order);
  }

  // Swap two section orders
  swapSectionOrder(dto: {
    userId: number;
    createCourseId: number;
    firstSectionId: number;
    secondSectionId: number;
  }): Observable<any> {
    return this.http.post(`${this.sectionOrderUrl}/swap`, dto);
  }

  getUserById(id: number): Observable<UserRegisterDto> {
    return this.http.get<UserRegisterDto>(`${this.authUrl}/get-user/${id}`);
  }

  getUserById1(id: number): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  getQuizBySection(sectionId: number): Observable<QuizDto1[]> {
    return this.http.get<any[]>(`${this.quizUrl}/section/${sectionId}`);
  }

  getFaqsByCourseId(courseId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.courseFaqUrl}/course/${courseId}`);
  }

  // POST: Add or update a FAQ
  addOrUpdateFaq(faq: any): Observable<any> {
    return this.http.post<any>(this.courseFaqUrl, faq);
  }

  // DELETE: Delete a FAQ by ID
  deleteFaq(id: number): Observable<void> {
    return this.http.delete<void>(`${this.courseFaqUrl}/${id}`);
  }

  getCourseSectionById(courseId: number): Observable<CourseSection[]> {
    return this.http.get<CourseSection[]>(
      `https://localhost:7215/api/Section/ByCourse/${courseId}`
    );
  }
  getVideosBySectionId(sectionId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `https://localhost:7215/api/Video/section/${sectionId}/videos`
    );
  }

  getAllCourses() {
    return this.http.get<any[]>(`${this.getCoursesUrl}`);
  }

  getLevels() {
    return this.http.get<string[]>(`${this.getCoursesUrl}/levels`);
  }

  getDurations() {
    return this.http.get<string[]>(`${this.getCoursesUrl}/durations`);
  }

  getSkills() {
    return this.http.get<string[]>(`${this.getCoursesUrl}/skills`);
  }

  getCoursesSubCategories() {
    return this.http.get<any[]>(
      'https://localhost:7215/api/getcourses/subcategories'
    );
  }
  getCoursesCategories() {
    return this.http.get<any[]>(`${this.getCoursesUrl}/categories`);
  }

  enrollInCourse(enrollment: any) {
    return this.http.post(
      'https://localhost:7215/api/CourseEnrollment',
      enrollment
    );
  }

  getEnrolledCoursesByUserId(userId: number) {
    return this.http.get<any[]>(
      `https://localhost:7215/api/CourseEnrollment/user/${userId}`
    );
  }

   toggleWishlist(data: {
    userId: number;
    createCourseId: number;
    courseWishlist: boolean;
    courseVisited?: boolean;
  }) {
    return this.http.post(`${this.wishListUrl}/wishlist`, data);
  }

  getUserWishlist(userId: number) {
  return this.http.get<any[]>(`${this.wishListUrl}/UserInteraction/wishlist/byuser/${userId}`);
}

getUserCourseDetails(courseId: number, userId: number) {
  return this.http.get<any>(`https://localhost:7215/api/Course/UserCourseDetails?courseId=${courseId}&userId=${userId}`);
}

}
