export interface IArticle {
  id: number;
  title: string;
  description: string;
  dateCreate: string;
  dateUpdate: string;
  content: IContent;
  authors: string[];
  respondents: string[];
  tags: string[];
  category: string;
}

export interface IContent {
  text: string;
  image: string;
}
