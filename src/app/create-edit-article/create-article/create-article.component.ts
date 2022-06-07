import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { IArticle } from './../../../app/interfaces/article';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss'],
})
export class CreateArticleComponent implements OnInit {
  public article$!: Observable<IArticle>;

  constructor() {}

  ngOnInit(): void {
    this.getArticle();
  }

  getArticle(): void {
    this.article$ = of({
      title: '',
      description: '',
      content: '',
      authors: [],
      department: [],
      category: '',
      tags: [],
    });
  }
}
