import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from 'src/app/error-modal/error-modal.service';
import { IDepartment } from 'src/app/interfaces/department';

@Injectable({
  providedIn: 'root',
})
export class CreateEditArticleService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient,
    private errorService: ErrorModalService
  ) {}

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/docker/tags`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );

        return throwError(() => error);
      })
    );
  }

  getAuthors(id: number): Observable<string[]> {
    return this.http
      .get<string[]>(`${this.apiUrl}/docker/departments/${id}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );

          return throwError(() => error);
        })
      );
  }

  getDepartments(): Observable<IDepartment[]> {
    return this.http
      .get<IDepartment[]>(`${this.apiUrl}/docker/departments`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.errorService.visibleForError(
            error.error.message[error.error.message.length - 1]
          );

          return throwError(() => error);
        })
      );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/docker/categories`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );

        return throwError(() => error);
      })
    );
  }
}
