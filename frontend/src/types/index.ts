export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  description: string;
  techStack: string[];
  category: string;
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  stats?: Record<string, string | number> | null;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string | null;
  startDate: string;
  endDate: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  color: string;
  order: number;
  createdAt: string;
}

