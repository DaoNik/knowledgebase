import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { IArticle } from '../interfaces/article';

@Injectable({
  providedIn: 'root',
})
export class ArticleService {
  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
  ) {}

  getArticles(): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(this.apiUrl);
  }

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`);
  }
}
