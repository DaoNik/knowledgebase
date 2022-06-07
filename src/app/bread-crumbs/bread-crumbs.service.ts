import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from '../error-modal/error-modal.service';
import { IArticle } from '../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class BreadCrumbsService {
  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string,
    private errorService: ErrorModalService
  ) {}

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/docker/articles/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.error.message) {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );
        }
        
        return throwError(() => error);
      })
    );
  }
}
