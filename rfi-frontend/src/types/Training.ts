export interface SubjectCategory {
  id: number;
  name: string;
  slug: string;
  description: string;
  imageUrl?: string;
  orderIndex: number;
  createdAt: string;
  trainingCount: number;
  trainings?: Training[];
}

export interface Training {
  id: number;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  videoUrl?: string;
  imageUrl?: string;
  readTimeMinutes?: number;
  orderIndex: number;
  createdAt: string;
  subjectCategoryId: number;
  subjectCategoryName?: string;
}
