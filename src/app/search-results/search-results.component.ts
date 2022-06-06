import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ArticleService } from '../article/article.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit, OnDestroy {
  articles: IArticle[] = [];
  articlesOnPage: number = 8;
  articlesonPageOptions: number[] = [8, 12, 16, 24, 48, 100]
  currentPageArticles: IArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;
  pages: number[] = [];

  subscriptionParams$!: Subscription;
  subscriptionArticles$!: Subscription;

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscriptionParams$ = this.route.params.subscribe((params) => {
      this.subscriptionArticles$ = this.articleService.getArticles().subscribe((articles) => {
        this.articles = articles.filter(
          (item) =>
            ((item.title.toLowerCase().includes(params['title'].toLowerCase()) || 
            item.description.toLowerCase().includes(params['title'].toLowerCase())) &&
            params['categories'].includes(item.category))
        );
        this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
        this.countPages();
      });
        
    });
  }

  ngOnDestroy() {
    this.subscriptionParams$.unsubscribe();
    this.subscriptionArticles$.unsubscribe();
  }

  openArticle(id: string) {
    this.router.navigate(['article', id]);
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < (this.articles.length / this.articlesOnPage); i++) {
      this.pages.push(i + 1);
    }
  }

  changeArticlesOnPage(count: number): void {
    this.articlesOnPage = count;
    this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
    this.countPages();
  }

  pageClick(page: number) {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(startArticle, startArticle + this.articlesOnPage);
    scroll(0,0)
  }
}
