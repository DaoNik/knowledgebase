import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private url: string = 'articles/api'

  constructor() { }
}
