export type Theme = "dark" | "light";

export interface Profile {
  id: string;
  fullName: string;
  professionalTitle: string;
  headline: string;
  biography: string;
  profileImageUrl?: string;
  location?: string;
  email?: string;
  phone?: string;
  availabilityStatus?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  resumeUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  slug: string;
  displayOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
  proficiency?: number;
  iconUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt?: string;
  displayOrder: number;
}

export type ProjectStatus = "draft" | "published" | "archived";

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  overview?: string;
  problem?: string;
  objectives?: string[];
  keyFeatures?: string[];
  contributions?: string[];
  coverImageUrl?: string;
  category?: string;
  techStack: string[];
  status: ProjectStatus;
  featured: boolean;
  liveUrl?: string;
  githubUrl?: string;
  developmentDate?: string;
  images: ProjectImage[];
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  description: string;
  responsibilities: string[];
  technologies: string[];
  achievements: string[];
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string;
  categoryId?: string;
  tagIds: string[];
  status: "draft" | "published" | "scheduled";
  featured: boolean;
  publishedAt?: string;
  scheduledAt?: string;
  readingTimeMinutes: number;
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unread" | "read" | "archived";
  createdAt: string;
}

export interface AnalyticsEvent {
  id: string;
  type: string;
  path?: string;
  referrer?: string;
  device?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface AiConversation {
  id: string;
  sessionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  aiAssistantEnabled: boolean;
  aiAssistantName: string;
  maintenanceMode: boolean;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
