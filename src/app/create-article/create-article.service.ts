import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IArticle } from './../interfaces/article';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ErrorModalService } from '../error-modal/error-modal.service';

@Injectable({
  providedIn: 'root',
})
export class CreateArticleService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient,
    private errorService: ErrorModalService
  ) {}

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  createArticle(article: IArticle): Observable<IArticle> {
    return this.http.post<IArticle>(`${this.apiUrl}`, article).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  editArticle(id: string, article: IArticle): Observable<IArticle> {
    return this.http.patch<IArticle>(`${this.apiUrl}/${id}`, article).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  getTags(): Observable<string[]> {
    return of(['Frontend', 'Backend', 'БД']);
  }

  getAuthors(): Observable<string[]> {
    return of(['Саша Сашин', 'Петр Петрович']);
  }

  getDepartments(): Observable<string[]> {
    return of([
      'Отдел разработки #1',
      'Отдел разработки #2',
      'Отдел разработки #3',
    ]);
  }

  getCategories(): Observable<string[]> {
    return of([
      'Склад',
      'Пункты выдачи',
      'Клиентская сторона',
      'Серверная сторона',
      'Логистика',
    ]);
  }
}
