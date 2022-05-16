import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { IArticle } from '../interfaces/article';
import { ArticleService } from './article.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss'],
})
export class ArticleComponent implements OnInit {
  article!: IArticle;

  articleId!: number;

  constructor(
    private articlesServ: ArticleService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.articlesServ.getArticles()
      .subscribe((articles: IArticle[]) => {
        articles.filter(item => {
          console.log(this.article)
          if (item.id === Number(params["id"])) this.article = item
        })
      })
    })
  }
}
