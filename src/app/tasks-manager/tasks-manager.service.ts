import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from '../error-modal/error-modal.service';
import { IComment } from './interfaces/comment';
import { IBoard, IColumn, ITask } from './interfaces/taskList.interface';

@Injectable({
  providedIn: 'root',
})
export class TasksManagerService {
  public loading$ = new BehaviorSubject(false);

  constructor(
    private http: HttpClient,
    private errorService: ErrorModalService,
    @Inject('API_URL') private apiUrl: string
  ) {}

  // Boards

  getBoard(): Observable<IBoard> {
    this.loading$.next(true);
    return this.http.get<IBoard>(`${this.apiUrl}/api/boards/1`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        this.loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  createBoard(
    title: string,
    authors?: string[],
    departments?: string[],
    tags?: string[],
    categories?: string[]
  ): Observable<IBoard> {
    return this.http
      .post<IBoard>(`${this.apiUrl}/api/boards`, {
        title,
        authors,
        departments,
        tags,
        categories,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  editBoard(
    id: number,
    title?: string,
    authors?: string[],
    departments?: string[],
    tags?: string[],
    categories?: string[]
  ): Observable<IBoard> {
    return this.http
      .post<IBoard>(`${this.apiUrl}/api/boards/${id}`, {
        title,
        authors,
        departments,
        tags,
        categories,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  // Columns

  getColumns() {
    return this.http.get<IColumn[]>(`${this.apiUrl}/api/columns`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  getColumn(id: number): Observable<IColumn> {
    return this.http.get<IColumn>(`${this.apiUrl}/api/columns/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  createColumn(boardId: number, title: string) {
    return this.http
      .post<IColumn>(`${this.apiUrl}/api/columns`, { boardId, title })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  editColumn(id: number, title: string) {
    return this.http
      .patch<IColumn>(`${this.apiUrl}/api/columns/${id}`, { title })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  deleteColumn(id: number) {
    return this.http.delete<number>(`${this.apiUrl}/api/columns/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  // Tasks

  getTasks(): Observable<ITask[]> {
    this.loading$.next(true);
    return this.http.get<ITask[]>(`${this.apiUrl}/api/tasks`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        this.loading$.next(false);
        return throwError(() => error);
      })
    );
  }

  getTask(id: number): Observable<ITask> {
    return this.http.get<ITask>(`${this.apiUrl}/api/tasks/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  createTask(
    columnId: number,
    title: string,
    boardId: number,
    contact: string,
    priority?: string,
    status?: string,
    description?: string[],
    authors?: string[],
    departments?: string[],
    tags?: string[],
    category?: string
  ): Observable<ITask> {
    return this.http
      .post<ITask>(`${this.apiUrl}/api/tasks`, {
        columnId,
        title,
        priority,
        status,
        description,
        authors,
        departments,
        tags,
        category,
        boardId,
        contact,
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  editTask(id: number, updatedData: any): Observable<ITask> {
    return this.http
      .patch<ITask>(`${this.apiUrl}/api/tasks/${id}`, updatedData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }

  deleteTask(id: number) {
    return this.http.delete<number>(`${this.apiUrl}/api/tasks/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  getTaskComments(id: number): Observable<IComment[]> {
    return this.http
      .get<IComment[]>(`${this.apiUrl}/api/tasks/${id}/comments`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
          return throwError(() => error);
        })
      );
  }
}
