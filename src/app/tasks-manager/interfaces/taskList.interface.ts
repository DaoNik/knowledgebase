export interface ITasksList2 {
    name: string;
    tasks: string[];
}

export interface ITask {
    authors: [];
    category: string;
    columnId: number;
    createdAt: string;
    description: string;
    id: number;
    priority: string;
    respondents: [];
    status: string;
    tags: [],
    title: string;
    updatedAt: string;
    paginator?: any;
}

export interface IBoard {
    authors: string[];
    category: string[];
    columns: IColumn[];
    createdAt: string;
    description: string;
    id: number;
    respondents: string[];
    tags: string[],
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