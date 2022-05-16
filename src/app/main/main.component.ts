import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleService } from '../article/article.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  articles: IArticle[] = [];

  constructor(
    private articleService: ArticleService, 
    private router: Router
    ) {}

  ngOnInit(): void {
    this.articleService
      .getArticles()
      .subscribe((articles) => (this.articles = articles));
  }

  openArticle(id: number) {
    this.router.navigate(['article', `${id}`]);
  }
}
