export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AIConversation {
  id: number;
  userId: number;
  title: string;
  type: ConversationType;
  createdAt: Date;
  updatedAt: Date;
  messages: AIMessage[];
}

export interface AIMessage {
  id: number;
  conversationId: number;
  content: string;
  isFromUser: boolean;
  timestamp: Date;
  metadata?: { [key: string]: any };
}

export enum ConversationType {
  General = 0,
  CareerGuidance = 1,
  SkillDevelopment = 2,
  JobSearch = 3,
  Interview = 4,
  CVReview = 5,
  Assessment = 6
}

export interface ChatRequest {
  message: string;
  context?: string;
}

export interface SkillAnalysisRequest {
  skills: string[];
  assessmentResults: number[];
}

export interface SkillAnalysisResult {
  identifiedSkills: string[];
  skillGaps: string[];
  recommendedLearningPaths: string[];
  overallSkillLevel: number;
}

export interface CareerRecommendationRequest {
  skills: string[];
  interests: string[];
  educationLevel?: string;
  experience?: string;
}

export interface CareerRecommendation {
  careerTitle: string;
  description: string;
  matchPercentage: number;
  requiredSkills: string[];
  recommendedCourses: string[];
}

export interface FileUpload {
  id: number;
  fileName: string;
  originalFileName: string;
  fileUrl: string;
  fileSize: number;
  contentType: string;
  uploadedAt: Date;
  categoryId?: number;
  tags: string[];
}

export interface CVTemplate {
  id: number;
  name: string;
  description: string;
  previewImageUrl?: string;
  templateData: string;
}

export interface UserCV {
  id: number;
  userId: number;
  templateId: number;
  title: string;
  personalInfo: PersonalInfo;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  references: Reference[];
  createdAt: Date;
  updatedAt: Date;
}

// CV interface for CV Builder component
export interface CV {
  id?: number;
  userId?: number;
  templateId?: number;
  title?: string;
  fullName: string;
  email: string;
  phone: string;
  location?: string;
  summary?: string;
  linkedInUrl?: string;
  workExperiences?: WorkExperience[];
  educations?: Education[];
  skills?: Skill[];
  languages?: Language[];
  certifications?: Certification[];
  references?: Reference[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  summary: string;
  profileImageUrl?: string;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isCurrentJob: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  description?: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  category: string;
}

export enum SkillLevel {
  Beginner = 1,
  Intermediate = 2,
  Advanced = 3,
  Expert = 4
}

export interface Language {
  name: string;
  proficiency: string;
}

export interface Certification {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Reference {
  name: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  sampleAnswer?: string;
  tips?: string;
}

export interface LearningPath {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: number;
  prerequisites: string[];
  learningObjectives: string[];
  imageUrl?: string;
  isActive: boolean;
}

export interface Content {
  id: number;
  title: string;
  description: string;
  contentType: string;
  contentUrl: string;
  duration?: number;
  learningPathId: number;
  order: number;
  isActive: boolean;
}

export interface Assessment {
  id: number;
  title: string;
  description: string;
  learningPathId: number;
  passingScore: number;
  timeLimit?: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  error?: string;
}
