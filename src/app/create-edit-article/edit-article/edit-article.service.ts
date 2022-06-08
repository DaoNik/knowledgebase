import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from 'src/app/error-modal/error-modal.service';
import { IArticle } from 'src/app/interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class EditArticleService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient,
    private errorService: ErrorModalService
  ) {}

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/docker/articles/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );

        return throwError(() => error);
      })
    );
  }

  editArticle(id: string, article: IArticle): Observable<IArticle> {
    return this.http
      .patch<IArticle>(`${this.apiUrl}/docker/articles/${id}`, article)
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
