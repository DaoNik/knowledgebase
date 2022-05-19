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
      });
    });
  }

  openArticle(id: string) {
    this.router.navigate(['article', id]);
  }
}
