import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from '../article/article.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  articles: IArticle[] = [];
  articlesOnPage: number = 8;
  currentPageArticles: IArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;
  pages: number[] = [];
  subscriptionArticles$!: Subscription;

  constructor(private articleService: ArticleService, private router: Router) {}

  ngOnInit(): void {
    this.subscriptionArticles$ = this.articleService
      .getArticles()
      .subscribe((articles) => {
        this.articles = articles;
        this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
        this.countPages();
      });
  }

  ngOnDestroy() {
    this.subscriptionArticles$.unsubscribe();
  }

  openArticle(id: string) {
    this.router.navigateByUrl(`article/${id}`);
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < (this.articles.length / this.articlesOnPage); i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number) {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(startArticle, startArticle + this.articlesOnPage);
  }
}
