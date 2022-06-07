import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { ErrorModalService } from 'src/app/error-modal/error-modal.service';
import { IArticle } from 'src/app/interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject('API_URL') private apiUrl: string,
    private errorService: ErrorModalService
  ) {}

  getArticles(): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(`${this.apiUrl}/docker/articles`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorService.visibleForError(
          error.error.message[error.error.message.length - 1]
        );
        return throwError(() => error);
      })
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('https://wbbase.site/docker/categories')
  }

  goToSearchResults(title: string, categories: string[]) {
    if (title == null)
      this.router.navigate(['search-result', ``, `${categories}`]);
    else this.router.navigate(['search-result', `${title}`, `${categories}`]);
  }
}
