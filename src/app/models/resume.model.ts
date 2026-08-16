export type TemplateType = 'modern' | 'classic' | 'minimal' | 'creative' | 'executive';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  bullets: string[];
}

export interface SkillGroup {
  id: string;
  category: string;
  skills: string[];
}

export interface Project {
  id: string;
  title: string;
  role: string;
  link?: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  bullets: string[];
}

export interface CustomSection {
  id: string;
  heading: string;
  items: CustomSectionItem[];
}

export type SectionType =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'custom';

export interface SectionConfig {
  id: string;
  type: SectionType;
  title: string;
  enabled: boolean;
  order: number;
}

export interface Resume {
  id: string;
  userId: string;
  title: string;
  template: TemplateType;
  personalInfo: PersonalInfo;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skillGroups: SkillGroup[];
  projects: Project[];
  certifications: Certification[];
  customSections: CustomSection[];
  sectionsOrder: SectionConfig[];
  updatedAt: string;
  isPublic: boolean;
  shareToken?: string;
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  versionName: string;
  snapshot: Resume;
  createdAt: string;
}
