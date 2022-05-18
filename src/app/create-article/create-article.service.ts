import { HttpClient } from '@angular/common/http';
import { IArticle } from './../interfaces/article';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CreateArticleService {
  constructor(
    @Inject('API_URL') private apiUrl: string,
    private http: HttpClient
  ) {}

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`);
  }

  createArticle(article: IArticle): Observable<IArticle> {
    return this.http.post<IArticle>(`${this.apiUrl}`, article);
  }

  editArticle(id: string, article: IArticle): Observable<IArticle> {
    return this.http.patch<IArticle>(`${this.apiUrl}/${id}`, article);
  }

  getTags(): Observable<string[]> {
    return of(['Frontend', 'Backend', 'БД']);
  }

  getAuthors(): Observable<string[]> {
    return of(['Саша Сашин', 'Петр Петрович']);
  }

  getRespondents(): Observable<string[]> {
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
