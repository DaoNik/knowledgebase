import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IArticle } from './../interfaces/article';
import { Inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { IDepartment } from '../interfaces/department';

@Injectable({
  providedIn: 'root',
})
export class CreateArticleService {
  private url = 'http://188.120.255.7:8080';

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient
  ) {}

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  createArticle(article: IArticle): Observable<IArticle> {
    return this.http.post<IArticle>(`${this.apiUrl}`, article).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  editArticle(id: string, article: IArticle): Observable<IArticle> {
    return this.http.patch<IArticle>(`${this.apiUrl}/${id}`, article).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  getTags(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/tags`);
  }

  getAuthors(id: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/departments/${id}`);
  }

  getDepartments(): Observable<IDepartment[]> {
    return this.http.get<IDepartment[]>(`${this.url}/department`);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.url}/categories`);
  }
}
