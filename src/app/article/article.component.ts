import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { IArticle } from '../interfaces/article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  article$!: Observable<IArticle>;
  subscriptionParams$!: Subscription;
  articleId!: number;

  constructor(
    private articlesServ: ArticleService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.subscriptionParams$ = this.route.params.subscribe((params: Params) => {
      this.article$ = this.articlesServ.getArticle(params['id']);
    });
  }

  ngOnDestroy() {
    this.subscriptionParams$.unsubscribe();
  }

}
