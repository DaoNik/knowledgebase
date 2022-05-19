import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ArticleService } from '../article/article.service';
import { IArticle } from '../interfaces/article';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent implements OnInit {
  articles: IArticle[] = [];
  articlesOnPage: number = 8;
  currentPageArticles: IArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;
  pages: number[] = [];

  constructor(
    private articleService: ArticleService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.articleService.getArticles().subscribe((articles) => {
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

  openArticle(id: string) {
    this.router.navigate(['article', id]);
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
