export interface NewsArticle {
  id: number;
  title: string;
  slug: string;
  summary: string;
  category: string | null;
  date: string;
  readTimeMinutes: number | null;
  videoUrl: string | null;
  imageUrl: string | null;
  createdAt: string;
  sections: NewsSection[];
}

export interface NewsSection {
  id: number;
  sectionType: string;
  title: string | null;
  orderIndex: number;
  keyPoints: KeyPoint[];
}

export interface KeyPoint {
  id: number;
  title: string | null;
  description: string;
  orderIndex: number;
}
