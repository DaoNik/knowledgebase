export interface IArticle {
  id?: string;
  title: string;
  description: string;
  dateCreate?: string;
  dateUpdate?: string;
  content: string;
  authors: string[];
  department: string[];
  tags: string[];
  category: string;
}
