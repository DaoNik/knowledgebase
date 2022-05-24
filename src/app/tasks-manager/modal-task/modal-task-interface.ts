export interface ITaskData {
	title: string,
	status: string,
	assignee: IAssignee[],
	description: string,
	text: IText[],
	date?: Date
}

export interface IAssignee {
	avatar: string,
	id: number,
	name: string
}

export interface IText {
	text: string,
	type: string,
	value: string
}

export interface ITypeOption {
	name: string,
    type: string,
    value: string
}