export interface IArticle {
  id?: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
  content: string;
  authors: string[];
  department: string[];
  tags: string[];
  category: string;
}
