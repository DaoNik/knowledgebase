export interface ITaskData {
	title: string,
	status: string,
	assignee: IAssignee[],
	description: string,
	text: string
	// date: Date
}

export interface IAssignee {
	avatar: string,
	name: string
}