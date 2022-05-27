import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { IArticle } from '../interfaces/article';

@Injectable({
  providedIn: 'root'
})
export class AdminPanelService {

  categoryNotListed = new BehaviorSubject<string>(localStorage.getItem('categoryNotListed') || 'Склад');
  categoryListed = new BehaviorSubject<string>(localStorage.getItem('categoryListed') || 'Склад');

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {}

  getArticles(category: string): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(`${this.apiUrl}?category=${category}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  deleteArticle(id: string): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  filterArticles(filterTags: []): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(`${this.apiUrl}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

}
