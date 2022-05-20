import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IArticle } from '../interfaces/article';

@Injectable({
  providedIn: 'root'
})
export class BreadCrumbsService {

  constructor(
    private http: HttpClient,
    @Inject('API_URL') private apiUrl: string
    ) { }

  getArticle(id: string): Observable<IArticle> {
    return this.http.get<IArticle>(`${this.apiUrl}/${id}`);
  }
}
