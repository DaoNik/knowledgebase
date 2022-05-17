import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { concatMap, mergeMap, Observable, of } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { AdminPanelService } from '../../admin-panel.service';

@Component({
  selector: 'app-not-listed-table',
  templateUrl: './not-listed-table.component.html',
  styleUrls: ['./not-listed-table.component.scss'],
})
export class NotListedTableComponent implements OnInit {
  articles: IArticle[] = [];
  article$!: Observable<IArticle[]>;
  articlesOnPage: number = 3;
  pages: number[] = [];
  category: string = ""

  currentPageArticles: IArticle[] = [];
  currentPage: number = 1;

  checkedArticles: string[] = [];

  constructor(
    private router: Router,
    private adminPanelService: AdminPanelService
  ) {}

  ngOnInit(): void {
    this.adminPanelService.categoryNotListed.pipe(
      mergeMap(topic => this.adminPanelService.getArticles(topic))
    ).subscribe((articles) => {
      this.articles = articles;
      this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
      this.countPages();
    })

    // this.adminPanelService.categoryNotListed.subscribe((topic) => {
    //   this.category = topic;
    // });

    // this.adminPanelService.getArticles(this.category).subscribe((articles) => {
    //   this.articles = articles;
    //   this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
    //   this.countPages();
    // });
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < this.articles.length / this.articlesOnPage; i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number): void {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(
      startArticle,
      startArticle + this.articlesOnPage
    );
  }

  deleteArticle(articleId: string) {
    this.articles.splice(
      this.articles.findIndex((article) => article._id === articleId),
      1
    );
    this.pageClick(this.currentPage);
    this.countPages();
    this.adminPanelService.deleteArticle(articleId).subscribe();
  }

  deleteSelected(articlesId: string[]): void {
    // articlesId.forEach((id) => this.articles.filter((el) => el.id === id))
    this.articles.filter((article) => !articlesId.includes(article._id!));
    // Здесь запрос на удаление выбранных элементов
  }

  checkArticle(articleId: string): void {
    if (!this.checkedArticles.includes(articleId)) {
      this.checkedArticles.push(articleId);
    } else {
      this.checkedArticles.splice(this.checkedArticles.indexOf(articleId), 1);
    }
  }

  sortByAlphabet(prev: IArticle, next: IArticle): number {
    return prev.title < next.title ? -1 : prev.title > next.title ? 1 : 0;
  }

  sortByID(prev: IArticle, next: IArticle): number {
    return prev._id! < next._id! ? -1 : prev._id! > next._id! ? 1 : 0;
  }

  sortByTeamlead(prev: IArticle, next: IArticle): number {
    return prev.authors[0] < next.authors[0]
      ? -1
      : prev.authors[0] > next.authors[0]
      ? 1
      : 0;
  }

  sortByTags(prev: IArticle, next: IArticle): number {
    if (prev.tags[0] < next.tags[0]) {
      return -1;
    }
    if (prev.tags[0] > next.tags[0]) {
      return 1;
    }
    return 0;
  }

  sortByFlag(flag: string): void {
    switch (flag) {
      case 'id':
        this.articles = this.articles.sort(this.sortByID);
        break;
      case 'header':
        this.articles = this.articles.sort(this.sortByAlphabet);
        break;
      case 'tags':
        this.articles = this.articles.sort(this.sortByTags);
        break;
      case 'teamlead':
        this.articles = this.articles.sort(this.sortByTeamlead);
        break;
    }
    this.pageClick(this.currentPage);
  }
}
