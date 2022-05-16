export interface IArticle {
  id: number;
  title: string;
  description: string;
  dateCreate?: string;
  dateUpdate?: string;
  content?: string;
  authors: string[];
  respondents: string[];
  tags: string[];
  category: string;
}
