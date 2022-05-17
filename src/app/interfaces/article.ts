export interface IArticle {
  _id?: string;
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
