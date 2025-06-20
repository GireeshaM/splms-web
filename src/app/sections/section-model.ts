export interface SectionDto {
  sectionId?: number;
  sectionName: string;
  sectionObjective?: string;
  sectionCreatedDate?: Date;
  sectionUpdatedDate?: Date | null;
  createdByUserId: number;
  isActive: boolean;
  createCourseId?: number;
  expanded?: boolean; // <-- UI flag (not persisted)
  showQuizForm?: boolean; // 🔥 NEW
  quizCount?: number;
  quizzes?: QuizDto[]; // Add this property for quizzes related to the section
  showVideoForm?: boolean;
  videos?: VideoSummaryDto[];
    sectionOrder?: number; // <-- Add this for order tracking

  orderJustSaved?: boolean;
  showVideos?:boolean;
}

export interface QuizDto {
  createQuizId: number;
  quizTitle: string;
  quizDescription?: string;
  expanded: boolean;
}

export interface QuizDto {
  createQuizId: number;
  quizTitle: string;
  quizDescription?: string;
  expanded: boolean;
}

export interface CreateQuizDto {
  createQuizId: number;
  quizTitle: string;
  quizDescription: string;
  quizCreationTime: Date;
  quizUpdateTime?: Date;
  sectionId: number;
  createdByUserId: number;
}

export interface UIQuiz extends CreateQuizDto {
  isMinimized: boolean;
}

export interface QuizQuestion {
  quizQuestionId?: number;
  createQuizId: number;
  questionTime?: number;
  quizQuestionText: string;
  questionCreatedDate?: Date;
  questionUpdatedDate?: Date;
  editing?: boolean;
  expanded?: boolean;
  collapsed?: boolean;
  showAnswers?: boolean;
}

export interface QuizAnswer {
  QuizAnswerId: number;
  QuizAnswerText: string;
  AnswerDescription: string | null;
  AnswerCreatedDate: string; // or Date type if you prefer
  AnswerUpdatedDate: string | null; // or Date type if you prefer
  AnswerCorrectOrNot: boolean; // true or false
  QuizQuestionId: number;
  visible: boolean; // A boolean to manage the visibility of each answer
}

export interface AddVideoDto {
  addVideoId: number;
  videoTitle: string;
  videoDescription: string;
  videoCreatedDate?: Date;
  videoUpdatedDate?: Date | null;
  createdByUserId: number;
  sectionId: number;
  videoContent?: string;
}

export interface VideoUploadDto {
  userId: number;
  videoId?: number;
  sectionId: number;
  videoName: string;
  description: string;
  fileType?: string;
  videoFileUpload: File;
  videoUrl?: string;
  videoDurtion?: number;
}

export interface VideoSummaryDto {
  videoId: number;
  videoName: string;
  description: string;
  fileType: string;
  orderId?: number;
  videoDuration: number;

}


export interface Timezones {
    zoneName: string;
    gmtOffset: number;
    gmtOffsetName: string;
    abbreviation: string;
    tzName: string;
}
export interface ICountry {
    name: string;
    phonecode: string;
    isoCode: string;
    flag: string;
    currency: string;
    latitude: string;
    longitude: string;
    timezones?: Timezones[];
    getAllCountries?(): ICountry[];
    getCountryByCode?(): ICountry;
}
export interface IState {
    name: string;
    isoCode: string;
    countryCode: string;
    latitude?: string | null;
    longitude?: string | null;
    getStatesOfCountry?(): IState[];
    getStateByCodeAndCountry?(): IState;
    getStateByCode?(): IState;
}
export interface ICity {
    name: string;
    countryCode: string;
    stateCode: string;
    latitude?: string | null;
    longitude?: string | null;
    getAllCities?(): ICity[];
    getCitiesOfState?(): ICity[];
    getCitiesOfCountry?(): ICity[];
}

export interface CreateCourse {
  createCourseId?: number;
  userId: number;
  categoryName: string;
  subCategoryName: string;
  courseTitle: string;
  demoVideo:string;
  courseDescription: string;
  level: string;
  duration: string;
  preRequirements: string[];
  skillsYouGain: string[];
  whatYouWillLearn: string[];
  courseOverview: string;
}

export interface CourseSection {
  sectionId: number;
  sectionName: string;
  sectionObjective: string;
  sectionCreatedDate: string;
  sectionUpdatedDate: string | null;
  createdByUserId: number;
  isActive: boolean;
  createCourseId: number | null;
  video?:Video[];
  quiz?:QuizDto1[];
  totalDuration?: number;
}

export interface Video {
  videoId: number;
  videoName: string;
  description: string;
  fileType: string;
  videoUrl?: string;
  duration?: number;
   videoDuration: number;

}
export interface QuizDto1 {
  createQuizId: number;
  quizTitle: string;
  quizDescription: string;
  quizCreationTime: string;   // ISO datetime string
  quizUpdateTime: string | null;
  sectionId: number;
  createdByUserId: number;
}

export interface CreateCourse {
  createCourseId?: number;
  userId: number;
  categoryId:number;
  subCategoryId:number;
  categoryName: string;
  subCategoryName: string;
  courseTitle: string;
  demoVideo:string;
  courseDescription: string;
  level: string;
  duration: string;
  preRequirements: string[];
  skillsYouGain: string[];
  whatYouWillLearn: string[];
  courseOverview: string;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  rolesId: number;
}

export interface MyProfiles{
  userId:number;
  rolesId:number;
  dateOfBirth:Date;
  maritalStatus:string;
  alternateMobileNumber:string;
  photoPath:string;
}