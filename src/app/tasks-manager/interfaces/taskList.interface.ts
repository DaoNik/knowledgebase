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
    priority: any;
    respondents: [];
    status: any;
    tags: [],
    title: string;
    updatedAt: string;
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
    tasks?: any[];
}