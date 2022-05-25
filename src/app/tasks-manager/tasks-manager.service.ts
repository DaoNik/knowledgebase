import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { IBoard, IColumn, ITask } from './interfaces/taskList.interface';

@Injectable({
  providedIn: 'root'
})
export class TasksManagerService {
  private url: string = 'http://51.250.111.214';

  constructor(private http: HttpClient) { }

  // Boards

  getBoard(): Observable<IBoard> {
    return this.http.get<IBoard>(`${this.url}/boards/1`)
  }

  createBoard(title: string, authors?: string[], respondents?: string[], tags?: string[], categories?: string[]): Observable<IBoard> {
    return this.http.post<IBoard>(`${this.url}/boards`, {title, authors, respondents, tags, categories})
  }

  editBoard(id: number, title?: string, authors?: string[], respondents?: string[], tags?: string[], categories?: string[]): Observable<IBoard> {
    return this.http.post<IBoard>(`${this.url}/boards/${id}`, {title, authors, respondents, tags, categories})
  }

  // Columns

  getColumns() {
    return this.http.get<any>(`${this.url}/columns`)
  }

  getColumn(id: number): Observable<IColumn> {
    return this.http.get<IColumn>(`${this.url}/columns/${id}`)
  }

  createColumn(boardId: number, title: string) {
    return this.http.post<IColumn>(`${this.url}/columns`, {boardId, title})
  }

  editColumn(id: number, title: string) {
    return this.http.patch<IColumn>(`${this.url}/columns/${id}`, {title})
  }

  deleteColumn(id: number) {
    return this.http.delete<number>(`${this.url}/columns/${id}`)
  }

  // Tasks

  getTask(id: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.url}/tasks/${id}`)
  }

  createTask(columnId: number, title: string, priority: string, status: string, description?: string, authors?: string, respondents?: string[], tags?: string[], category?: string): Observable<ITask> {
    return this.http.post<ITask>(`${this.url}/tasks`, {columnId, title, priority, status, description, authors, respondents, tags, category})
  }

  editTask(id: number, updatedData: any): Observable<ITask> {
    return this.http.patch<ITask>(`${this.url}/tasks/${id}`, updatedData).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteTask(id: number) {
    return this.http.delete<number>(`${this.url}/tasks/${id}`)
  }
}