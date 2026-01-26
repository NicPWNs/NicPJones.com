// Site-specific interfaces (used by components)
export interface Certification {
  name: string;
  issueDate: string;
  expirationDate: string | null;
  verificationLink?: string;
  issuer: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  gpa: string | null;
  notes: string[];
}

export interface WorkExperience {
  company: string;
  location: string;
  period?: string;
  positions: {
    title: string;
    period: string;
    responsibilities: string[];
  }[];
}

export interface Award {
  name: string;
  date: string;
  description?: string;
}

export interface Exploit {
  cve: string;
  description: string;
  date: string;
  reportLink: string;
  cveLink?: string;
}

export interface Project {
  name: string;
  period: string;
  description: string;
  skills: string[];
  link: string;
}

// JSON Resume schema types (from gist)
export interface JsonResumeCertificate {
  name: string;
  date: string;
  issuer: string;
  url?: string;
}

export interface JsonResumeEducation {
  institution: string;
  url?: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate?: string;
  score?: string;
  courses?: string[];
}

export interface JsonResumeWork {
  name: string;
  position: string;
  url?: string;
  location: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

export interface JsonResumeAward {
  title: string;
  date: string;
  awarder?: string;
  summary?: string;
}

export interface JsonResumePublication {
  name: string;
  publisher: string;
  releaseDate: string;
  url: string;
  summary?: string;
}

export interface JsonResumeProject {
  name: string;
  startDate: string;
  endDate?: string;
  description: string;
  highlights?: string[];
  url: string;
}

export interface JsonResume {
  basics: {
    name: string;
    label: string;
    image?: string;
    email: string;
    phone?: string;
    url?: string;
    summary?: string;
    location?: {
      address?: string;
      postalCode?: string;
      city?: string;
      countryCode?: string;
      region?: string;
    };
    profiles?: {
      network: string;
      username: string;
      url: string;
    }[];
  };
  work: JsonResumeWork[];
  education: JsonResumeEducation[];
  awards: JsonResumeAward[];
  certificates: JsonResumeCertificate[];
  publications: JsonResumePublication[];
  projects: JsonResumeProject[];
  skills?: {
    name: string;
    keywords: string[];
  }[];
  languages?: {
    language: string;
    fluency: string;
  }[];
  interests?: {
    name: string;
    keywords: string[];
  }[];
  volunteer?: unknown[];
  references?: unknown[];
}
