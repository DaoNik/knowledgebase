import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private url: string = 'http://localhost:4500/mock-articles.json'

  constructor(
    private http: HttpClient
  ) { }

  getArticles(): Observable<IArticle[]> {
    return this.http.get<IArticle[]>(this.url)
  }
}
