import { IArticle } from './../../interfaces/article';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { ErrorModalService } from 'src/app/error-modal/error-modal.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CreateArticleService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient,
    private errorService: ErrorModalService
  ) {}

  getArticle(): Observable<IArticle> {
    return of({
      title: '',
      description: '',
      content: '',
      authors: [],
      department: [],
      category: '',
      tags: [],
    });
  }

  createArticle(article: IArticle): Observable<IArticle> {
    return this.http
      .post<IArticle>(`${this.apiUrl}/docker/articles`, article)
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
