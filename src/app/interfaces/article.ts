import { IDepartment } from './department';

export interface IArticle {
  id?: string;
  title: string;
  description: string;
  dateCreate?: string;
  dateUpdate?: string;
  content: string;
  authors: string[];
  department: IDepartment[];
  tags: string[];
  category: string;
}
