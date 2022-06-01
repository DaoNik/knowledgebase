export interface ITask {
  authors: string[];
  category: string;
  columnId: number;
  createdAt: string;
  description: string;
  id: number;
  contact: string;
  priority: string;
  departments: string[];
  status: string;
  tags: string[];
  title: string;
  updatedAt: string;
  boardId: number;
  paginator?: any;
}

export interface IBoard {
  authors: string[];
  category: string[];
  columns: IColumn[];
  createdAt: string;
  description: string;
  id: number;
  departments: string[];
  tags: string[];
  title: string;
  updatedAt: string;
}

export interface IColumn {
  boardId: number;
  createdAt: string;
  id: number;
  title: string;
  updatedAt: string;
  tasks?: ITask[];
}
