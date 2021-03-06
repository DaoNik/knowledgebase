import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { concatMap, map, Subscription } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { AdminPanelService } from '../../admin-panel.service';

interface adminArticle {
  id: string;
  header: string;
  tags: string[];
  teamlead: string[];
}

@Component({
  selector: 'app-articles-table',
  templateUrl: './articles-table.component.html',
  styleUrls: ['./articles-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticlesTableComponent implements OnInit, OnDestroy {
  articles: IArticle[] = [];
  subscriptionCategoryListed$!: Subscription;
  articlesOnPage: number = 3;
  pages: number[] = [];
  currentTopic: string = '';

  currentPageArticles: IArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;

  checkedArticles: string[] = [];
  filterTags: string[] = [];

  search: FormControl = new FormControl('');
  tagInput: FormControl = new FormControl('');

  constructor(
    private adminService: AdminPanelService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  topic: string = '';

  ngOnInit(): void {
    this.subscriptionCategoryListed$ = this.adminService.categoryListed
      .pipe(
        map((topic) => (this.topic = topic)),
        concatMap((topic) => this.adminService.getArticles(topic))
      )
      .subscribe((articles) => {
        this.articles = [];
        articles.forEach((article) => {
          if (article.category === this.topic) {
            this.articles.push(article);
          }
        });
        this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
        this.countPages();
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy() {
    this.subscriptionCategoryListed$.unsubscribe();
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
      this.articles.findIndex((article) => article.id === articleId),
      1
    );
    this.pageClick(this.currentPage);
    this.countPages();
    this.adminService.deleteArticle(articleId).subscribe(() => {
      this.changeDetectorRef.markForCheck();
    });
  }

  deleteCheckedArticles() {
    this.checkedArticles.forEach((article) => {
      this.deleteArticle(article);
    });
    this.checkedArticles = [];
    this.resetPage();
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

  sortByAuthors(prev: IArticle, next: IArticle): number {
    return prev.authors[0] < next.authors[0]
      ? -1
      : prev.authors[0] > next.authors[0]
      ? 1
      : 0;
  }

  sortByDepartments(prev: IArticle, next: IArticle): number {
    return prev.department[0] < next.department[0]
      ? -1
      : prev.department[0] > next.department[0]
      ? 1
      : 0;
  }

  sortByTags(prev: adminArticle, next: adminArticle): number {
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
      case 'departments':
        this.articles = this.articles.sort(this.sortByDepartments);
        break;
      case 'header':
        this.articles = this.articles.sort(this.sortByAlphabet);
        break;
      case 'authors':
        this.articles = this.articles.sort(this.sortByAuthors);
        break;
    }
    this.pageClick(this.currentPage);
  }

  resetPage(): void {
    this.currentPage = 1;
    this.pageClick(this.currentPage);
    this.countPages();
  }
}
