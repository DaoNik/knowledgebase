import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { mergeMap } from 'rxjs';
import { IArticle } from 'src/app/interfaces/article';
import { AdminPanelService } from '../../admin-panel.service';

interface adminArticle {
  id: string;
  header: string;
  tags: string[];
  teamlead: string[];
};

const mockArticles: adminArticle[] = [
  {
    id: 'id10',
    header: 'A 100 способов сделать это...100 способов сделать это...100 способов сделать это...',
    tags: ['тег1', 'тег2'],
    teamlead: ['username', 'username2', 'username3'],
  },
  {
    id: 'id20',
    header: 'B 100 способов сделать это...',
    tags: ['тег1', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id30',
    header: 'A 100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id40',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег3'],
    teamlead: ['username'],
  },
  {
    id: 'id50',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2'],
    teamlead: ['username'],
  },
  {
    id: 'id60',
    header: '100 способов сделать это...',
    tags: ['тег2', 'тег3'],
    teamlead: ['username', 'username2'],
  },
  {
    id: 'id70',
    header: '100 способов сделать это...',
    tags: ['тег1', 'тег2', 'тег4'],
    teamlead: ['username'],
  }
];

@Component({
  selector: 'app-articles-table',
  templateUrl: './articles-table.component.html',
  styleUrls: ['./articles-table.component.scss'],
})
export class ArticlesTableComponent implements OnInit {
  articles: IArticle[] = [];
  articlesOnPage: number = 3;
  pages: number[] = [];

  currentPageArticles: IArticle[] = this.articles.slice(0, this.articlesOnPage);
  currentPage: number = 1;

  checkedArticles: string[] = [];
  filterTags: string[] = [];

  search: FormControl = new FormControl('');
  tagInput: FormControl = new FormControl('');

  constructor(private adminService: AdminPanelService) { }

  ngOnInit(): void {
    this.adminService.categoryListed.pipe(
      mergeMap(topic => this.adminService.getArticles(topic))
    ).subscribe((articles) => {
      this.articles = articles;
      this.currentPageArticles = this.articles.slice(0, this.articlesOnPage);
      this.countPages();
    });
  }

  countPages(): void {
    this.pages = [];
    for (let i = 0; i < (this.articles.length / this.articlesOnPage); i++) {
      this.pages.push(i + 1);
    }
  }

  pageClick(page: number): void {
    this.currentPage = page;
    const startArticle: number = (page - 1) * this.articlesOnPage;
    this.currentPageArticles = this.articles.slice(startArticle, startArticle + this.articlesOnPage);
  }

  deleteArticle(articleId: string) {
    this.articles.splice(this.articles.findIndex(article => article._id === articleId), 1);
    this.pageClick(this.currentPage);
    this.countPages();
    this.adminService.deleteArticle(articleId).subscribe();
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

  sortByRespondents(prev: IArticle, next: IArticle): number {
    return prev.respondents[0] < next.respondents[0]
      ? -1
      : prev.respondents[0] > next.respondents[0]
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
      case 'respondents':
        this.articles = this.articles.sort(this.sortByRespondents);
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
