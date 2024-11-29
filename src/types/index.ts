export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  sourceUrl: string;
  publishDate: Date;
  category: string;
  source: string;
}

export interface Summary {
  overview: string;
  keyPoints: string[];
}

export interface AIResponse {
  answer: string;
  loading: boolean;
  error: string | null;
}