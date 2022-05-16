export interface IArticle {
  id: number;
  title: string;
  description: string;
  dateCreate?: string;
  dateUpdate?: string;
  content: {
    text: string;
    image?: string;
  };
  authors: string[];
  respondents: string[];
  tags: string[];
  category: string;
}
